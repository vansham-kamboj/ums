import { useState } from 'react';
import { Bus, MapPin, Plus, Search, Users, Navigation, Clock, ChevronRight, Edit2, Phone, User, Fuel, AlertTriangle, Settings } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Tabs from '../../components/ui/Tabs';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

const DEMO_ROUTES = [
  { id: 1, name: 'Route A — North Circuit', stops: ['Main Gate', 'Sector 15', 'City Center', 'Railway Station', 'Airport Road'], vehicle: 'UP-32-AB-1234', driver: 'Ramesh Kumar', driverPhone: '9876543210', students: 28, status: 'active', distance: '22 km', time: '45 min' },
  { id: 2, name: 'Route B — South Circuit', stops: ['Main Gate', 'IT Park', 'Cyber City', 'Huda Market', 'Golf Course Rd'], vehicle: 'UP-32-CD-5678', driver: 'Suresh Yadav', driverPhone: '9876543211', students: 35, status: 'active', distance: '18 km', time: '35 min' },
  { id: 3, name: 'Route C — East Circuit', stops: ['Main Gate', 'NH-24', 'Indirapuram', 'Vaishali', 'Kaushambi'], vehicle: 'UP-32-EF-9012', driver: 'Mahesh Sharma', driverPhone: '9876543212', students: 22, status: 'active', distance: '30 km', time: '55 min' },
  { id: 4, name: 'Route D — West Circuit', stops: ['Main Gate', 'Dwarka', 'Janakpuri', 'Rajouri Garden'], vehicle: 'UP-32-GH-3456', driver: 'Dinesh Gupta', driverPhone: '9876543213', students: 15, status: 'inactive', distance: '25 km', time: '50 min' },
];

const DEMO_VEHICLES = [
  { id: 1, number: 'UP-32-AB-1234', type: 'Bus (45 seater)', make: 'Tata Starbus', year: 2023, fuelType: 'Diesel', lastService: '2026-07-15', nextService: '2026-10-15', status: 'active', kmRun: 45200 },
  { id: 2, number: 'UP-32-CD-5678', type: 'Mini Bus (25 seater)', make: 'Force Traveller', year: 2024, fuelType: 'Diesel', lastService: '2026-08-01', nextService: '2026-11-01', status: 'active', kmRun: 28300 },
  { id: 3, number: 'UP-32-EF-9012', type: 'Bus (45 seater)', make: 'Ashok Leyland', year: 2022, fuelType: 'Diesel', lastService: '2026-06-20', nextService: '2026-09-20', status: 'maintenance', kmRun: 62100 },
  { id: 4, number: 'UP-32-GH-3456', type: 'Van (12 seater)', make: 'Mahindra Marazzo', year: 2025, fuelType: 'Petrol', lastService: '2026-08-10', nextService: '2026-11-10', status: 'active', kmRun: 12400 },
];

export default function TransportRouteView() {
  const toast = useToast();
  const [routes] = useState(DEMO_ROUTES);
  const [vehicles] = useState(DEMO_VEHICLES);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [search, setSearch] = useState('');

  const filteredRoutes = routes.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));
  const totalStudents = routes.reduce((s, r) => s + r.students, 0);

  const routesTab = (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
        <input type="text" placeholder="Search routes..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredRoutes.map(route => (
            <button key={route.id} onClick={() => setSelectedRoute(route)}
              className={`w-full text-left bg-surface border rounded-md p-4 hover:shadow-sm transition-all ${
                selectedRoute?.id === route.id ? 'border-brand-500 ring-2 ring-brand-600/20' : 'border-border'
              }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                    route.status === 'active' ? 'bg-success-100 text-success-600' : 'bg-bg text-text-disabled'
                  }`}>
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">{route.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-text-disabled inline-flex items-center gap-0.5"><Navigation className="w-3 h-3" />{route.distance}</span>
                      <span className="text-xs text-text-disabled inline-flex items-center gap-0.5"><Clock className="w-3 h-3" />{route.time}</span>
                      <span className="text-xs text-text-disabled inline-flex items-center gap-0.5"><Users className="w-3 h-3" />{route.students} students</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={route.status === 'active' ? 'active' : 'inactive'} label={route.status} size="xs" />
              </div>
              <div className="flex items-center gap-1 mt-2 overflow-x-auto">
                {route.stops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-1 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-brand-600" />
                    <span className="text-[10px] text-text-disabled whitespace-nowrap">{stop}</span>
                    {i < route.stops.length - 1 && <div className="w-4 h-px bg-brand-300" />}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Route Detail */}
        <div>
          {!selectedRoute ? (
            <div className="bg-surface border border-border rounded-md p-8 text-center">
              <Bus className="w-10 h-10 mx-auto text-text-disabled/40 mb-3" />
              <p className="text-sm text-text-disabled">Select a route to view details</p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-md overflow-hidden sticky top-4">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-text-primary">{selectedRoute.name}</h3>
                <StatusBadge status={selectedRoute.status === 'active' ? 'active' : 'inactive'} label={selectedRoute.status} size="xs" />
              </div>
              <div className="px-5 py-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">Vehicle</span><span className="font-mono text-text-primary">{selectedRoute.vehicle}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Driver</span><span className="text-text-primary">{selectedRoute.driver}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Contact</span><span className="text-text-primary">{selectedRoute.driverPhone}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Distance</span><span className="text-text-primary">{selectedRoute.distance}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Est. Time</span><span className="text-text-primary">{selectedRoute.time}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Students</span><span className="font-bold text-brand-600">{selectedRoute.students}</span></div>
              </div>
              <div className="border-t border-border px-5 py-3">
                <h4 className="text-xs font-semibold text-text-disabled uppercase mb-3">Stops ({selectedRoute.stops.length})</h4>
                <div className="space-y-2">
                  {selectedRoute.stops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${i === 0 ? 'bg-brand-600 border-brand-600' : i === selectedRoute.stops.length - 1 ? 'bg-success-600 border-success-600' : 'bg-white border-brand-400'}`} />
                        {i < selectedRoute.stops.length - 1 && <div className="w-0.5 h-4 bg-brand-200" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-text-disabled" />
                        <span className="text-sm text-text-primary">{stop}</span>
                        {i === 0 && <span className="text-[10px] text-brand-600 font-medium">(Start)</span>}
                        {i === selectedRoute.stops.length - 1 && <span className="text-[10px] text-success-600 font-medium">(End)</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const vehiclesTab = (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Vehicle</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Make/Year</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-text-disabled uppercase tracking-wider">KM Run</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Next Service</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-text-disabled uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map(v => {
              const serviceOverdue = new Date(v.nextService) < new Date();
              return (
                <tr key={v.id} className="hover:bg-bg/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Bus className="w-5 h-5 text-brand-600" />
                      <span className="text-sm font-mono font-medium text-text-primary">{v.number}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-text-secondary">{v.type}</td>
                  <td className="px-5 py-3.5 text-sm text-text-secondary">{v.make} ({v.year})</td>
                  <td className="px-5 py-3.5 text-sm text-text-primary text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{v.kmRun.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm ${serviceOverdue ? 'text-danger-600 font-medium inline-flex items-center gap-1' : 'text-text-secondary'}`}>
                      {serviceOverdue && <AlertTriangle className="w-3.5 h-3.5" />}
                      {v.nextService}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge
                      status={v.status === 'active' ? 'active' : v.status === 'maintenance' ? 'pending' : 'inactive'}
                      label={v.status}
                      size="xs"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Transport Management</h1>
          <p className="text-sm text-text-secondary mt-1">Manage routes, vehicles, and student assignments</p>
        </div>
        <button className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md transition-colors inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Route
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-md p-4">
          <p className="text-xs text-text-disabled mb-1">Active Routes</p>
          <p className="text-xl font-bold text-text-primary">{routes.filter(r => r.status === 'active').length}</p>
        </div>
        <div className="bg-surface border border-border rounded-md p-4">
          <p className="text-xs text-text-disabled mb-1">Total Vehicles</p>
          <p className="text-xl font-bold text-brand-600">{vehicles.length}</p>
        </div>
        <div className="bg-surface border border-border rounded-md p-4">
          <p className="text-xs text-text-disabled mb-1">Students Using</p>
          <p className="text-xl font-bold text-success-600">{totalStudents}</p>
        </div>
        <div className={`border rounded-md p-4 ${vehicles.some(v => v.status === 'maintenance') ? 'bg-warning-100/30 border-warning-200' : 'bg-surface border-border'}`}>
          <p className="text-xs text-text-disabled mb-1">In Maintenance</p>
          <p className="text-xl font-bold text-warning-600">{vehicles.filter(v => v.status === 'maintenance').length}</p>
        </div>
      </div>

      <Tabs tabs={[
        { key: 'routes', label: 'Routes & Stops', icon: Navigation, count: routes.length, content: routesTab },
        { key: 'vehicles', label: 'Vehicles', icon: Bus, count: vehicles.length, content: vehiclesTab },
      ]} />
    </div>
  );
}