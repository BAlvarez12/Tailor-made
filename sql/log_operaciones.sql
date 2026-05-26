-- =====================================================================
-- Tabla única de auditoría: registra cada creación / edición /
-- eliminación que ocurra en el sistema.
--
-- Campos:
--   usuario_id       quién hizo la operación (FK a usuarios)
--   accion           'crear' | 'editar' | 'eliminar' | 'inactivar' | 'activar' | 'archivar' | 'restaurar'
--   entidad          nombre lógico del objeto: 'cliente', 'material', 'rol', 'cotizacion', etc.
--   entidad_id       id del registro afectado (nullable, ej. acciones masivas)
--   descripcion      texto humano corto para mostrar en una lista
--   datos_antes      JSON con el estado previo (solo para editar/eliminar)
--   datos_despues    JSON con el estado nuevo (solo para crear/editar)
--   ip               IP del request
--   user_agent       navegador / cliente
--   fecha            timestamp automático
-- =====================================================================

CREATE TABLE IF NOT EXISTS log_operaciones (
  log_id        INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT NULL,
  accion        VARCHAR(20)  NOT NULL,
  entidad       VARCHAR(50)  NOT NULL,
  entidad_id    INT NULL,
  descripcion   VARCHAR(255) NULL,
  datos_antes   JSON NULL,
  datos_despues JSON NULL,
  ip            VARCHAR(45)  NULL,
  user_agent    VARCHAR(255) NULL,
  fecha         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_log_usuario (usuario_id),
  INDEX idx_log_entidad (entidad, entidad_id),
  INDEX idx_log_fecha   (fecha),
  INDEX idx_log_accion  (accion),

  CONSTRAINT fk_log_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificación
SHOW CREATE TABLE log_operaciones;
