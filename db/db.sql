-- Set timezone for the current session
set
  timezone = 'America/Lima';

alter database postgres set timezone = 'America/Lima';

--Or permanently alter the database (recommended)
alter database postgres
set
  timezone = 'America/Lima';



create type employee_role as ENUM('ADMIN', 'SUPERVISOR', 'RECEPTIONIST', 'TEACHER');

create type discount_type as ENUM(
  'PERCENTAGE', -- % del total
  'FIXED_AMOUNT' -- monto fijo
);

create type session_status as ENUM(
  'ACTIVE', -- el niño está dentro
  'CLOSED', -- salió, cobro generado
  'FREE' -- sesión gratis por tarjeta fidelidad
);

create type class_day as ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

create type gender as ENUM('MALE', 'FEMALE');

-- ============================================================
-- SUCURSALES
-- ============================================================
create table branch (
  id BIGSERIAL primary key,
  name VARCHAR(100) not null,
  address VARCHAR(255) not null,
  phone VARCHAR(20),
  email VARCHAR(100),
  is_active BOOLEAN not null default true,
  -- auditoría
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);

-- ============================================================
-- EMPLEADOS
-- ============================================================
create table employee (
  id BIGSERIAL primary key,
  branch_id BIGINT not null references branch (id),
  auth_user_id UUID unique references auth.users (id),
  first_name VARCHAR(100) not null,
  last_name VARCHAR(100) not null,
  document_number VARCHAR(20) not null unique,
  role employee_role not null,
  phone VARCHAR(20),
  email VARCHAR(100),
  hire_date DATE not null,
  is_active BOOLEAN not null default true,
  -- auditoría
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);

create index idx_employee_branch on employee (branch_id);

create index idx_employee_role on employee (role);

-- ============================================================
-- ACCESOS
-- ============================================================
create table menu_item (
  id BIGSERIAL primary key,
  label VARCHAR(100) not null, -- "Pedidos", "Reportes"...
  path VARCHAR(200) not null unique, -- "/orders", "/reports"
  icon VARCHAR(50), -- nombre del icono, ej: "ShoppingCart"
  parent_id BIGINT references menu_item (id), -- para submenús
  sort_order INTEGER not null default 0,
  is_active BOOLEAN not null default true,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null default 'system'
);

-- Qué roles pueden ver cada opción
create table menu_role_permission (
  id BIGSERIAL primary key,
  menu_item_id BIGINT not null references menu_item (id) on delete CASCADE,
  role employee_role not null,
  enabled BOOLEAN not null default true,
  constraint uq_menu_role unique (menu_item_id, role)
);

-- Índices
create index idx_mrp_role on menu_role_permission (role);

create index idx_mrp_item on menu_role_permission (menu_item_id);

---
-- ============================================================
-- GUARDIÁN (padre / apoderado)
-- El portal público usa su documento para consultar
-- ============================================================
create table guardian (
  id BIGSERIAL primary key,
  full_name VARCHAR(200) not null,
  document_number VARCHAR(20) not null unique, -- DNI / cédula
  phone VARCHAR(20),
  email VARCHAR(100),
  code VARCHAR(20) not null unique,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);


create index idx_guardian_document on guardian (document_number);
create index idx_guardian_code on child (code);


 CREATE OR REPLACE FUNCTION fn_generate_guardian_code () 
       RETURNS TRIGGER LANGUAGE plpgsql AS $$
       BEGIN
         NEW.code := 'P-' || LPAD(NEW.id::TEXT, 6, '0');
         RETURN NEW;
       END;
       $$;
       
      CREATE TRIGGER trg_guardian_code
      BEFORE INSERT ON guardian
      FOR EACH ROW
      WHEN (NEW.code IS NULL OR NEW.code = '')
      EXECUTE FUNCTION fn_generate_guardian_code();

 

-- ============================================================
-- NIÑO
-- ============================================================
create table child (
  id BIGSERIAL primary key,
  guardian_id BIGINT not null references guardian (id),
  branch_id BIGINT not null references branch (id),
  full_name VARCHAR(200) not null,
  gender gender not null,
  avatar VARCHAR(200),
  birth_date DATE not null,
  -- Código único para QR/consulta pública (ej: "KIDS-000042")
  code VARCHAR(20) not null unique,
  notes TEXT, -- alergias, condiciones, etc.
  is_active BOOLEAN not null default true,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);

create index idx_child_guardian on child (guardian_id);

create index idx_child_code on child (code);

create index idx_chils_gender on child (gender);

---
-- ============================================================
-- TRIGGER: genera código automático al insertar un niño
-- ============================================================
create or replace function fn_generate_child_code () RETURNS TRIGGER LANGUAGE plpgsql as $$
BEGIN
  NEW.code := 'KIDS-' || LPAD(NEW.id::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

create trigger trg_child_code BEFORE INSERT on child for EACH row when (
  NEW.code is null
  or NEW.code = ''
)
execute FUNCTION fn_generate_child_code ();

----
-- ============================================================
-- CONFIGURACIÓN DE PRECIO POR HORA
-- Solo 1 registro activo por sede a la vez.
-- El historial queda para auditoría.
-- ============================================================
create table pricing_config (
  id BIGSERIAL primary key,
  branch_id BIGINT not null references branch (id),
  price_per_hour NUMERIC(10, 2) not null check (price_per_hour > 0),
  -- precio mínimo a cobrar aunque el niño se quede menos de 1h
  minimum_charge NUMERIC(10, 2) not null default 0,
  description VARCHAR(100),
  valid_from TIMESTAMP not null default CURRENT_TIMESTAMP,
  valid_until TIMESTAMP, -- NULL = vigente hasta nuevo aviso
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);

create index idx_pricing_branch on pricing_config (branch_id, valid_from desc);

select
  *
from
  pricing_config
  -- ============================================================
  -- CUPONES DE DESCUENTO
  -- ============================================================
create table coupon (
  id BIGSERIAL primary key,
  branch_id BIGINT references branch (id), -- NULL = todas las sedes
  code VARCHAR(50) not null unique,
  description VARCHAR(200),
  discount_type discount_type not null,
  discount_value NUMERIC(10, 2) not null check (discount_value > 0),
  max_uses INTEGER, -- NULL = ilimitado
  uses_count INTEGER not null default 0,
  valid_from DATE not null default CURRENT_DATE,
  valid_until DATE, -- NULL = sin vencimiento
  is_active BOOLEAN not null default true,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);

create index idx_coupon_code on coupon (code)
where
  is_active = true;

----
-- ============================================================
-- TARJETA DE FIDELIDAD
-- Una por niño. Acumula sellos; al llegar a stamps_required
-- se otorga 1 sesión gratis automáticamente.
-- ============================================================
create table loyalty_card (
  id BIGSERIAL primary key,
  child_id BIGINT not null unique references child (id),
  stamps_count INTEGER not null default 0,
  stamps_required INTEGER not null default 5, -- configurable
  free_sessions INTEGER not null default 0, -- disponibles para canjear
  total_earned INTEGER not null default 0, -- histórico total ganadas
  updated_at TIMESTAMP,
  constraint chk_stamps check (
    stamps_count >= 0
    and stamps_count < stamps_required
  )
);

alter table loyalty_card
alter column stamps_required
set default 5;

-- ============================================================
-- SELLOS INDIVIDUALES (historial)
-- ============================================================
create table loyalty_stamp (
  id BIGSERIAL primary key,
  loyalty_card_id BIGINT not null references loyalty_card (id),
  play_session_id BIGINT, -- se llena al cerrar sesión (FK añadida después)
  stamped_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  note VARCHAR(100) -- "Sesión gratis ganada", etc.
);

create index idx_stamp_card on loyalty_stamp (loyalty_card_id);

select
  *
from
  loyalty_card
  -- ============================================================
  -- TRIGGER: al añadir un sello, verifica si alcanzó el límite
  -- y otorga sesión gratis reiniciando el contador
  -- ============================================================
create or replace function fn_check_loyalty_reward () RETURNS TRIGGER LANGUAGE plpgsql as $$
DECLARE
  v_card loyalty_card%ROWTYPE;
BEGIN
  SELECT * INTO v_card FROM loyalty_card WHERE id = NEW.loyalty_card_id;

  -- Suma el sello
  UPDATE loyalty_card
  SET stamps_count = stamps_count + 1,
      updated_at   = CURRENT_TIMESTAMP
  WHERE id = NEW.loyalty_card_id;

  -- Refresca
  SELECT * INTO v_card FROM loyalty_card WHERE id = NEW.loyalty_card_id;

  -- ¿Completó la tarjeta?
  IF v_card.stamps_count >= v_card.stamps_required THEN
    UPDATE loyalty_card
    SET stamps_count  = 0,
        free_sessions = free_sessions + 1,
        total_earned  = total_earned + 1,
        updated_at    = CURRENT_TIMESTAMP
    WHERE id = NEW.loyalty_card_id;
  END IF;

  RETURN NEW;
END;
$$;

create or replace function fn_check_loyalty_reward () RETURNS TRIGGER LANGUAGE plpgsql as $$                    
  BEGIN                                                                                                                                                    
    UPDATE loyalty_card
    SET                                                                                                                                                    
      stamps_count  = CASE                                  
                        WHEN stamps_count + 1 >= stamps_required THEN 0
                        ELSE stamps_count + 1                                                                                                              
                      END,
      free_sessions = free_sessions + CASE                                                                                                                 
                        WHEN stamps_count + 1 >= stamps_required THEN 1
                        ELSE 0                                                                                                                             
                      END,
      total_earned  = total_earned + CASE                                                                                                                  
                        WHEN stamps_count + 1 >= stamps_required THEN 1
                        ELSE 0
                      END,                                                                                                                                 
      updated_at    = NOW() AT TIME ZONE 'America/Lima'
    WHERE id = NEW.loyalty_card_id;                                                                                                                        
                                                            
    RETURN NEW;
  END;
  $$;

create trigger trg_loyalty_reward
after INSERT on loyalty_stamp for EACH row
execute FUNCTION fn_check_loyalty_reward ();

-----
select
  *
from
  child
  -- ============================================================
  -- CATEGORÍA DE PRODUCTO
  -- ============================================================
create table product_category (
  id BIGSERIAL primary key,
  name VARCHAR(100) not null unique, -- "Snacks", "Bebidas"
  is_active BOOLEAN not null default true,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);

-- ============================================================
-- PRODUCTO
-- ============================================================
create table product (
  id BIGSERIAL primary key,
  branch_id BIGINT references branch (id), -- NULL = todos
  category_id BIGINT not null references product_category (id),
  name VARCHAR(150) not null,
  price NUMERIC(10, 2) not null check (price >= 0),
  stock INTEGER not null default 0 check (stock >= 0),
  image_url VARCHAR(500),
  is_active BOOLEAN not null default true,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null default 'system',
  updated_at TIMESTAMP,
  updated_by VARCHAR(100)
);

create index idx_product_category on product (category_id);

-- ============================================================
-- SESIÓN DE JUEGO
-- ============================================================
create table play_session (
  id BIGSERIAL primary key,
  branch_id BIGINT not null references branch (id),
  child_id BIGINT not null references child (id),
  pricing_id BIGINT not null references pricing_config (id),
  coupon_id BIGINT references coupon (id),
  registered_by BIGINT not null references employee (id),
  closed_by BIGINT references employee (id),
  status session_status not null default 'ACTIVE',
  is_free_session BOOLEAN not null default false, -- canjeó sesión gratis
  check_in TIMESTAMP not null default CURRENT_TIMESTAMP,
  check_out TIMESTAMP,
  -- Calculados automáticamente al cerrar (trigger)
  minutes_played INTEGER,
  play_subtotal NUMERIC(10, 2), -- horas × precio
  products_subtotal NUMERIC(10, 2) default 0,
  discount_amount NUMERIC(10, 2) default 0,
  total_amount NUMERIC(10, 2), -- lo que paga el padre
  notes TEXT,
  scheduled_checkout timestamp with time zone,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);



--ALTER TABLE play_session                                                                                                                                 
--ADD COLUMN IF NOT EXISTS scheduled_checkout TIMESTAMP WITH TIME ZONE;
create index idx_session_child on play_session (child_id);

create index idx_session_branch on play_session (branch_id);

create index idx_session_status on play_session (status)
where
  status = 'ACTIVE';

create index idx_session_checkin on play_session (check_in desc);

-- FK diferida: loyalty_stamp → play_session
alter table loyalty_stamp
add constraint fk_stamp_session foreign KEY (play_session_id) references play_session (id);

-- ============================================================
-- CONSUMO DE PRODUCTOS EN SESIÓN
-- ============================================================
create table session_consumption (
  id BIGSERIAL primary key,
  play_session_id BIGINT not null references play_session (id),
  product_id BIGINT not null references product (id),
  quantity INTEGER not null default 1 check (quantity > 0),
  unit_price NUMERIC(10, 2) not null, -- precio al momento de comprar
  subtotal NUMERIC(10, 2) GENERATED ALWAYS as (quantity * unit_price) STORED,
  added_by BIGINT references employee (id),
  added_at TIMESTAMP not null default CURRENT_TIMESTAMP
);

create index idx_consumption_session on session_consumption (play_session_id);

----
-- ============================================================
-- Al hacer check_out, el sistema automáticamente:
--   1. Calcula minutos y monto de juego
--   2. Aplica descuento del cupón si tiene
--   3. Suma productos consumidos
--   4. Registra el sello de fidelidad
--   5. Actualiza el contador de usos del cupón
-- ============================================================
create or replace function fn_close_play_session () RETURNS TRIGGER LANGUAGE plpgsql as $$
DECLARE
  v_minutes        INTEGER;
  v_hours          NUMERIC;
  v_play_amount    NUMERIC(10,2);
  v_products_total NUMERIC(10,2);
  v_discount       NUMERIC(10,2) := 0;
  v_coupon         coupon%ROWTYPE;
  v_pricing        pricing_config%ROWTYPE;
  v_card_id        BIGINT;
BEGIN
  -- Solo actúa cuando se setea check_out y antes era NULL
  IF NEW.check_out IS NULL OR OLD.check_out IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- 1. Calcula tiempo jugado
  v_minutes := EXTRACT(EPOCH FROM (NEW.check_out - NEW.check_in)) / 60;
  v_hours   := GREATEST(v_minutes::NUMERIC / 60, 0);

  SELECT * INTO v_pricing FROM pricing_config WHERE id = NEW.pricing_id;

  IF NEW.is_free_session THEN
    v_play_amount := 0;
  ELSE
    v_play_amount := GREATEST(
      ROUND(v_hours * v_pricing.price_per_hour, 2),
      v_pricing.minimum_charge
    );
  END IF;

  -- 2. Total de productos consumidos
  SELECT COALESCE(SUM(subtotal), 0) INTO v_products_total
  FROM session_consumption
  WHERE play_session_id = NEW.id;

  -- 3. Aplica cupón de descuento
  IF NEW.coupon_id IS NOT NULL AND NOT NEW.is_free_session THEN
    SELECT * INTO v_coupon FROM coupon WHERE id = NEW.coupon_id;
    IF v_coupon.discount_type = 'PERCENTAGE' THEN
      v_discount := ROUND(v_play_amount * v_coupon.discount_value / 100, 2);
    ELSE
      v_discount := LEAST(v_coupon.discount_value, v_play_amount);
    END IF;
    UPDATE coupon SET uses_count = uses_count + 1 WHERE id = NEW.coupon_id;
  END IF;

  -- 4. Actualizar stock de productos consumidos
  UPDATE product p
  SET stock = p.stock - sc.quantity,
      updated_at = NOW(),
      updated_by = COALESCE(NEW.updated_by, NEW.closed_by::VARCHAR, 'system')
  FROM session_consumption sc
  WHERE sc.play_session_id = NEW.id
    AND p.id = sc.product_id;

  -- 4. Persiste los montos calculados
  NEW.minutes_played    := v_minutes;
  NEW.play_subtotal     := v_play_amount;
  NEW.products_subtotal := v_products_total;
  NEW.discount_amount   := v_discount;
  NEW.total_amount      := (v_play_amount - v_discount) + v_products_total;
  NEW.status            := CASE WHEN NEW.is_free_session THEN 'FREE' ELSE 'CLOSED' END;
  NEW.check_out         := NOW() AT TIME ZONE 'America/Lima';

  -- 5. Registra sello de fidelidad (solo si no es sesión gratis)
  IF NOT NEW.is_free_session THEN
    SELECT id INTO v_card_id FROM loyalty_card WHERE child_id = NEW.child_id;
    IF v_card_id IS NOT NULL THEN
      INSERT INTO loyalty_stamp (loyalty_card_id, play_session_id)
      VALUES (v_card_id, NEW.id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

create trigger trg_close_session BEFORE
update OF check_out on play_session for EACH row
execute FUNCTION fn_close_play_session ();

----
-- ============================================================
-- CLASE / PROGRAMA DE ESTIMULACIÓN
-- ============================================================
create table stimulation_class (
  id BIGSERIAL primary key,
  branch_id BIGINT not null references branch (id),
  teacher_id BIGINT references employee (id),
  name VARCHAR(150) not null, -- "Estimulación 0-1 año"
  description TEXT,
  age_min_months INTEGER not null default 0,
  age_max_months INTEGER not null default 36,
  capacity INTEGER not null default 10,
  price NUMERIC(10, 2) not null default 0,
  -- Horario recurrente semanal
  day_of_week class_day not null,
  start_time TIME not null,
  end_time TIME not null,
  is_active BOOLEAN not null default true,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  created_by VARCHAR(100) not null,
  updated_at TIMESTAMP,
  updated_by VARCHAR(100),
  deleted_at TIMESTAMP
);

ALTER TABLE stimulation_class
    ALTER COLUMN day_of_week TYPE class_day[]
    USING ARRAY[day_of_week];

-- ============================================================
-- INSCRIPCIÓN A CLASE
-- ============================================================
create table class_enrollment (
  id BIGSERIAL primary key,
  class_id BIGINT not null references stimulation_class (id),
  child_id BIGINT not null references child (id),
  enrolled_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  enrolled_by BIGINT references employee (id),
  is_active BOOLEAN not null default true,
  constraint uq_enrollment unique (class_id, child_id)
);

-- ============================================================
-- ASISTENCIA A CLASE (registro por cada sesión real)
-- ============================================================
create table class_attendance (
  id BIGSERIAL primary key,
  enrollment_id BIGINT not null references class_enrollment (id),
  class_date DATE not null,
  attended BOOLEAN not null default true,
  noted_by BIGINT references employee (id),
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  constraint uq_attendance unique (enrollment_id, class_date)
);

-- ============================================================
-- MENU_ITEM inserts
-- ============================================================
insert into
  menu_item (label, path, icon, sort_order, created_by)
values
  ('Dashboard', '/', 'LayoutDashboard', 1, 'system'),
  ('Sucursales', '/branches', 'Store', 2, 'system'),
  ('Empleados', '/employees', 'IdCardLanyard', 3, 'system'),
  (
    'Padres/Guardianes',
    '/guardians',
    'UserStar',
    4,
    'system'
  ),
  ('Niños', '/children', 'Baby', 5, 'system'),
  ('Precios', '/pricing', 'CircleDollarSign', 6, 'system'),
  ('Cupones', '/coupons', 'Tags', 7, 'system'),
  ('Sesiones', '/sessions', 'AlarmClockPlus', 8, 'system'),
  ('Categorias', '/product-categories', 'PackageSearch', 9, 'system'),
  ('Productos', '/products', 'ShoppingBasket', 10, 'system'),
  ('Lista de clases', '/stimulation-classes', 'BookOpenText', 11, 'system'),
  ('Reporte Asistencias', '/attendance-report', 'ClipboardList', 11, 'system'),
  (
    'Accesos',
    '/settings/permissions',
    'ShieldCheck',
    99,
    'system'
  );

insert into
  menu_role_permission (menu_item_id, role, enabled)
select
  m.id,
  v.role::employee_role,
  v.enabled
from
  menu_item m
  join (
    values
      ('/', 'ADMIN', true),
      ('/branches', 'ADMIN', true),
      ('/employees', 'ADMIN', true),
      ('/guardians', 'ADMIN', true),
      ('/children', 'ADMIN', true),
      ('/pricing', 'ADMIN', true),
      ('/coupons', 'ADMIN', true),
      ('/sessions', 'ADMIN', true),
      ('/product-categories', 'ADMIN', true),
      ('/products', 'ADMIN', true),
      ('/stimulation-classes', 'ADMIN', true),
      ('/attendance-report', 'ADMIN', true),
      ('/settings/permissions', 'ADMIN', true)
  ) as v (path, role, enabled) on m.path = v.path;

