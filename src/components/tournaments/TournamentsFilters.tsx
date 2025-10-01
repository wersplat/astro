type SearchParamsType = {
  search?: string;
  status?: string;
  tier?: string;
  sort?: string;
  page?: string;
};

export default function TournamentsFilters({ searchParams }: { searchParams: SearchParamsType }) {
  return (
    <div className="paper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search tournaments..." 
          className="input"
          defaultValue={searchParams.search}
        />
        <select className="input" defaultValue={searchParams.status || ''}>
          <option value="">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select className="input" defaultValue={searchParams.tier || ''}>
          <option value="">All Tiers</option>
          <option value="1">T1 - Major LANs</option>
          <option value="2">T2 - Franchise</option>
          <option value="3">T3 - Qualifiers</option>
          <option value="4">T4 - Invitationals</option>
          <option value="5">T5 - Community</option>
        </select>
        <select className="input" defaultValue={searchParams.sort || 'date'}>
          <option value="date">Start Date</option>
          <option value="tier">Tier</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
}
