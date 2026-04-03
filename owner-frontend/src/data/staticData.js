 /* ─────────── STATIC DATA ─────────── */
export const staticTurfs = [
  { id:1, name:'Green Arena', address:'Andheri West, Mumbai', price:800,  slots:12, bookings:8,  status:'active',   img:'⚽' },
  { id:2, name:'City Turf',   address:'Powai, Mumbai',        price:1000, slots:8,  bookings:5,  status:'active',   img:'🏟️' },
  { id:3, name:'Pro Ground',  address:'Bandra, Mumbai',        price:1200, slots:6,  bookings:2,  status:'inactive', img:'🌿' },
]

export const staticSlots = [
  { id:1, turf:'Green Arena', date:'2026-04-05', start:'06:00', end:'07:00', price:800,  booked:true,  bookedBy:'Rahul S.' },
  { id:2, turf:'Green Arena', date:'2026-04-05', start:'07:00', end:'08:00', price:800,  booked:false, bookedBy:null },
  { id:3, turf:'Green Arena', date:'2026-04-05', start:'08:00', end:'09:00', price:900,  booked:true,  bookedBy:'Amit K.' },
  { id:4, turf:'City Turf',   date:'2026-04-05', start:'09:00', end:'10:00', price:1000, booked:false, bookedBy:null },
  { id:5, turf:'City Turf',   date:'2026-04-05', start:'18:00', end:'19:00', price:1200, booked:true,  bookedBy:'Priya M.' },
  { id:6, turf:'Pro Ground',  date:'2026-04-06', start:'06:00', end:'07:00', price:1200, booked:false, bookedBy:null },
  { id:7, turf:'Green Arena', date:'2026-04-06', start:'07:00', end:'08:00', price:800,  booked:false, bookedBy:null },
  { id:8, turf:'City Turf',   date:'2026-04-06', start:'20:00', end:'21:00', price:1400, booked:true,  bookedBy:'Suresh T.' },
]

export const staticBookings = [
  { id:'#B001', user:'Rahul Sharma',  mobile:'9876543210', turf:'Green Arena', date:'Apr 5, 2026', slot:'06:00–07:00', amount:800,  status:'confirmed', paid:true  },
  { id:'#B002', user:'Amit Kumar',    mobile:'9123456789', turf:'Green Arena', date:'Apr 5, 2026', slot:'08:00–09:00', amount:900,  status:'confirmed', paid:false },
  { id:'#B003', user:'Priya Mehta',   mobile:'9988776655', turf:'City Turf',   date:'Apr 5, 2026', slot:'18:00–19:00', amount:1200, status:'confirmed', paid:true  },
  { id:'#B004', user:'Suresh Tiwari', mobile:'9871234560', turf:'City Turf',   date:'Apr 6, 2026', slot:'20:00–21:00', amount:1400, status:'confirmed', paid:true  },
  { id:'#B005', user:'Neha Joshi',    mobile:'9765432100', turf:'Pro Ground',  date:'Apr 3, 2026', slot:'07:00–08:00', amount:1200, status:'cancelled', paid:false },
  { id:'#B006', user:'Karan Patel',   mobile:'9654321098', turf:'Green Arena', date:'Apr 7, 2026', slot:'09:00–10:00', amount:800,  status:'confirmed', paid:false },
]