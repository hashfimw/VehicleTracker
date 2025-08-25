CREATE TABLE IF NOT EXISTS vehicle_statuses (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('trip', 'idle', 'stopped')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) DEFAULT 0 CHECK (speed >= 0),
    fuel_level DECIMAL(5, 2) DEFAULT 0 CHECK (fuel_level >= 0 AND fuel_level <= 100),
    engine_temp INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicle_statuses_vehicle_id ON vehicle_statuses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_statuses_timestamp ON vehicle_statuses(timestamp);
CREATE INDEX IF NOT EXISTS idx_vehicle_statuses_vehicle_timestamp ON vehicle_statuses(vehicle_id, timestamp DESC);