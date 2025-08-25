-- Insert users
INSERT INTO users (email, password, full_name, role) VALUES
('admin@vehicletracker.com', '$2a$12$nWYa5RRsuU1u93LiYCtSOOe4DwMeA1gOAA7Q21jVAj59H/46a0GlS', 'Admin User', 'admin'),
('user@vehicletracker.com', '$2a$12$nWYa5RRsuU1u93LiYCtSOOe4DwMeA1gOAA7Q21jVAj59H/46a0GlS', 'Demo User', 'user'),
('manager@vehicletracker.com', '$2a$12$nWYa5RRsuU1u93LiYCtSOOe4DwMeA1gOAA7Q21jVAj59H/46a0GlS', 'Fleet Manager', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert vehicles
INSERT INTO vehicles (license_plate, brand, model, year, color, fuel_type) VALUES
('B1234ABC', 'Toyota', 'Avanza', 2022, 'White', 'gasoline'),
('B5678DEF', 'Honda', 'Civic', 2021, 'Silver', 'gasoline'),
('B9012GHI', 'Tesla', 'Model 3', 2023, 'Black', 'electric'),
('B3456JKL', 'Mitsubishi', 'Pajero', 2020, 'Red', 'diesel'),
('B7890MNO', 'Suzuki', 'Ertiga', 2022, 'Blue', 'gasoline'),
('B2468PQR', 'Isuzu', 'D-Max', 2021, 'Gray', 'diesel'),
('B1357STU', 'Hyundai', 'Ioniq', 2023, 'Green', 'hybrid'),
('B8024VWX', 'Daihatsu', 'Xenia', 2020, 'Orange', 'gasoline')
ON CONFLICT (license_plate) DO NOTHING;

-- Insert vehicle statuses with CTE
WITH vehicle_ids AS (
    SELECT id, license_plate FROM vehicles
),
date_series AS (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE,
        INTERVAL '1 hour'
    ) AS timestamp
),
status_data AS (
    SELECT 
        v.id as vehicle_id,
        d.timestamp,
        CASE 
            WHEN EXTRACT(hour FROM d.timestamp) BETWEEN 6 AND 22 THEN
                CASE 
                    WHEN (random() * 10)::int IN (0,1,2,3) THEN 'trip'
                    WHEN (random() * 10)::int IN (4,5) THEN 'idle' 
                    ELSE 'stopped'
                END
            ELSE 'stopped'
        END as status,
        -6.2 + (random() * 0.4) as latitude,  -- Jakarta area
        106.8 + (random() * 0.4) as longitude,
        CASE 
            WHEN EXTRACT(hour FROM d.timestamp) BETWEEN 6 AND 22 THEN (random() * 80)::numeric(5,2)
            ELSE 0
        END as speed,
        (20 + (random() * 60))::numeric(5,2) as fuel_level, -- Random fuel level 20-80%
        (80 + (random() * 40))::int as engine_temp -- Random temp 80-120°C
    FROM vehicle_ids v
    CROSS JOIN date_series d
    WHERE d.timestamp <= CURRENT_TIMESTAMP
)
INSERT INTO vehicle_statuses (
    vehicle_id, status, latitude, longitude, speed, fuel_level, engine_temp, timestamp
)
SELECT 
    vehicle_id, status, latitude, longitude, speed, fuel_level, engine_temp, timestamp
FROM status_data
ON CONFLICT DO NOTHING;