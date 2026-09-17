import { useState } from 'react';
import { Building2, Users, Plus, Search, X, User, Loader2, Bed, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';

const DEMO_BLOCKS = [
  {
    id: 'b1', name: 'Block A — Boys', type: 'Boys',
    floors: [
      { floor: 1, rooms: [
        { id: 'a101', number: '101', capacity: 3, occupied: 3, occupants: [{ name: 'Aarav S.', id: 's1' }, { name: 'Rohit K.', id: 's2' }, { name: 'Vikram S.', id: 's3' }] },
        { id: 'a102', number: '102', capacity: 3, occupied: 2, occupants: [{ name: 'Karan J.', id: 's4' }, { name: 'Dev P.', id: 's5' }] },
        { id: 'a103', number: '103', capacity: 3, occupied: 0, occupants: [] },
        { id: 'a104', number: '104', capacity: 4, occupied: 3, occupants: [{ name: 'Arjun M.', id: 's6' }, { name: 'Sahil R.', id: 's7' }, { name: 'Nitin B.', id: 's8' }] },
        { id: 'a105', number: '105', capacity: 3, occupied: 1, occupants: [{ name: 'Rahul D.', id: 's9' }] },
        { id: 'a106', number: '106', capacity: 3, occupied: 3, occupants: [{ name: 'Vivek T.', id: 's10' }, { name: 'Arun G.', id: 's11' }, { name: 'Suresh N.', id: 's12' }] },
      ]},
      { floor: 2, rooms: [
        { id: 'a201', number: '201', capacity: 3, occupied: 2, occupants: [{ name: 'Manish K.', id: 's13' }, { name: 'Pankaj S.', id: 's14' }] },
        { id: 'a202', number: '202', capacity: 3, occupied: 3, occupants: [{ name: 'Rajesh V.', id: 's15' }, { name: 'Deepak M.', id: 's16' }, { name: 'Ankit C.', id: 's17' }] },
        { id: 'a203', number: '203', capacity: 4, occupied: 1, occupants: [{ name: 'Harsh P.', id: 's18' }] },
        { id: 'a204', number: '204', capacity: 3, occupied: 0, occupants: [] },
        { id: 'a205', number: '205', capacity: 3, occupied: 2, occupants: [{ name: 'Sanjay R.', id: 's19' }, { name: 'Vijay L.', id: 's20' }] },
        { id: 'a206', number: '206', capacity: 3, occupied: 3, occupants: [{ name: 'Pradeep K.', id: 's21' }, { name: 'Mohan S.', id: 's22' }, { name: 'Ravi T.', id: 's23' }] },
      ]},
    ],
  },
  {
    id: 'b2', name: 'Block B — Girls', type: 'Girls',
    floors: [
      { floor: 1, rooms: [
        { id: 'b101', number: '101', capacity: 3, occupied: 2, occupants: [{ name: 'Priya P.', id: 's24' }, { name: 'Sneha G.', id: 's25' }] },
        { id: 'b102', number: '102', capacity: 3, occupied: 3, occupants: [{ name: 'Ananya M.', id: 's26' }, { name: 'Meera R.', id: 's27' }, { name: 'Kavya S.', id: 's28' }] },
        { id: 'b103', number: '103', capacity: 4, occupied: 2, occupants: [{ name: 'Neha K.', id: 's29' }, { name: 'Pooja D.', id: 's30' }] },
        { id: 'b104', number: '104', capacity: 3, occupied: 0, occupants: [] },
        { id: 'b105', number: '105', capacity: 3, occupied: 3, occupants: [{ name: 'Ritu S.', id: 's31' }, { name: 'Sonia M.', id: 's32' }, { name: 'Isha P.', id: 's33' }] },
      ]},
    ],
  },
];

function getRoomStatusStyle(occupied, capacity) {
  const ratio = occupied / capacity;
  if (ratio === 0) return 'glass-subtle border-glass-border text-muted-foreground';
  if (ratio >= 1) return 'bg-rose-500/15 border-rose-500/30 text-rose-500 font-bold';
  if (ratio >= 0.66) return 'bg-amber-500/15 border-amber-500/30 text-amber-600 font-bold';
  return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 font-bold';
}

export default function HostelOccupancy() {
  const toast = useToast();
  const [blocks] = useState(DEMO_BLOCKS);
  const [selectedBlock, setSelectedBlock] = useState(DEMO_BLOCKS[0]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  const totalCapacity = selectedBlock.floors.reduce((s, f) => s + f.rooms.reduce((rs, r) => rs + r.capacity, 0), 0);
  const totalOccupied = selectedBlock.floors.reduce((s, f) => s + f.rooms.reduce((rs, r) => rs + r.occupied, 0), 0);
  const totalRooms = selectedBlock.floors.reduce((s, f) => s + f.rooms.length, 0);
  const vacantRooms = selectedBlock.floors.reduce((s, f) => s + f.rooms.filter(r => r.occupied < r.capacity).length, 0);

  const handleAllocate = () => {
    if (!selectedRoom) return;
    const updated = {
      ...selectedRoom,
      occupied: selectedRoom.occupied + 1,
      occupants: [...selectedRoom.occupants, { name: 'New Student', id: `ns-${Date.now()}` }]
    };
    setSelectedRoom(updated);
    toast.success('Student allocated to room ' + updated.number);
    setShowAllocateModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Hostel Room Occupancy</h1>
          <p className="text-sm text-muted-foreground mt-1">Visual floor plan showing room occupancy across hostel blocks</p>
        </div>
        <button
          onClick={() => setShowAllocateModal(true)}
          className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Allocate Student
        </button>
      </div>

      {/* Block Switcher Pills */}
      <div className="flex gap-2">
        {blocks.map(block => (
          <button
            key={block.id}
            onClick={() => { setSelectedBlock(block); setSelectedRoom(null); }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2 border ${
              selectedBlock.id === block.id
                ? 'bg-brand text-white border-brand shadow-md'
                : 'glass-subtle border-glass-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="w-4 h-4" /> {block.name}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Total Rooms</p>
          <p className="text-2xl font-bold text-foreground font-heading">{totalRooms}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Total Capacity</p>
          <p className="text-2xl font-bold text-brand font-heading">{totalCapacity} Beds</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Total Occupied</p>
          <p className="text-2xl font-bold text-emerald-600 font-heading">{totalOccupied} Students</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Vacant Rooms</p>
          <p className="text-2xl font-bold text-amber-600 font-heading">{vacantRooms} Rooms</p>
        </div>
      </div>

      {/* Floor Matrix Plan */}
      <div className="space-y-6">
        {selectedBlock.floors.map(floorObj => (
          <div key={floorObj.floor} className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <h3 className="text-base font-bold text-foreground font-heading">
                Floor {floorObj.floor}
              </h3>
              <span className="text-xs text-muted-foreground font-semibold">{floorObj.rooms.length} Rooms</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {floorObj.rooms.map(room => {
                const isSelected = selectedRoom?.id === room.id;
                const statusStyle = getRoomStatusStyle(room.occupied, room.capacity);

                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`glass-card-interactive p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${statusStyle} ${
                      isSelected ? 'ring-2 ring-brand shadow-lg scale-105' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold font-mono">Room {room.number}</span>
                      <Bed className="w-4 h-4 opacity-80" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold">{room.occupied} / {room.capacity} Beds</p>
                      <p className="text-[10px] opacity-75 mt-0.5">
                        {room.occupied === 0 ? 'Vacant' : room.occupied === room.capacity ? 'Full' : 'Partial'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Room Details & Allocation Drawer Modal */}
      <Modal open={!!selectedRoom} onClose={() => setSelectedRoom(null)} title={`Room ${selectedRoom?.number} Details`}>
        {selectedRoom && (
          <div className="space-y-4">
            <div className="glass-panel p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-glass-border pb-2">
                <div>
                  <h3 className="text-base font-bold text-foreground">Room {selectedRoom.number}</h3>
                  <p className="text-xs text-muted-foreground">Block {selectedBlock.name}</p>
                </div>
                <StatusBadge
                  status={selectedRoom.occupied >= selectedRoom.capacity ? 'danger' : selectedRoom.occupied > 0 ? 'pending' : 'active'}
                  label={selectedRoom.occupied >= selectedRoom.capacity ? 'Full' : `${selectedRoom.capacity - selectedRoom.occupied} Beds Available`}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Current Occupants ({selectedRoom.occupants.length})</p>
                {selectedRoom.occupants.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No students currently allocated to this room.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedRoom.occupants.map((occ, i) => (
                      <div key={i} className="glass-subtle p-2.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-foreground">
                        <User className="w-4 h-4 text-brand" />
                        <span>{occ.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedRoom(null)} className="secondary-button text-xs px-4 py-2">Close</button>
              {selectedRoom.occupied < selectedRoom.capacity && (
                <button onClick={handleAllocate} className="primary-button text-xs px-4 py-2 inline-flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Allocate Student
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}