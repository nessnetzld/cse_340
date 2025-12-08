CREATE TABLE IF NOT EXISTS public.appointments (
  appointment_id SERIAL PRIMARY KEY,
  account_id INT NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE,
  inv_id INT NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type VARCHAR(50) NOT NULL CHECK (appointment_type IN ('Test Drive', 'Service')),
  appointment_note TEXT,
  appointment_status VARCHAR(50) NOT NULL DEFAULT 'Pending'
    CHECK (appointment_status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, inv_id, appointment_date, appointment_time)
);

CREATE INDEX IF NOT EXISTS idx_appointments_account ON public.appointments(account_id);
CREATE INDEX IF NOT EXISTS idx_appointments_inv ON public.appointments(inv_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(appointment_status);