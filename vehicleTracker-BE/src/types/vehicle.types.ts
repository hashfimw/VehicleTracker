export interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleStatus {
  id: number;
  vehicleId: number;
  status: 'trip' | 'idle' | 'stopped';
  latitude: number;
  longitude: number;
  speed: number;
  fuelLevel: number;
  engineTemp: number;
  timestamp: Date;
  createdAt: Date;
}

export interface VehicleWithLatestStatus extends Vehicle {
  latestStatus?: VehicleStatus;
}

export interface VehicleStatusQuery {
  vehicleId: number;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface VehicleReportData {
  vehicle: Vehicle;
  statuses: VehicleStatus[];
  summary: {
    totalTrips: number;
    totalIdleTime: number;
    totalStoppedTime: number;
    totalDistance: number;
    averageSpeed: number;
  };
}