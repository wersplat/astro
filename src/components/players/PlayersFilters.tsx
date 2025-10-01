type SearchParamsType = {
  search?: string;
  position?: string;
  team?: string;
  sort?: string;
  page?: string;
};

export default function PlayersFilters({ searchParams }: { searchParams: SearchParamsType }) {
  return (
    <div className="paper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search players..." 
          className="input"
          defaultValue={searchParams.search}
        />
        <select className="input" defaultValue={searchParams.position || ''}>
          <option value="">All Positions</option>
          <option value="Point Guard">Point Guard</option>
          <option value="Shooting Guard">Shooting Guard</option>
          <option value="Small Forward">Small Forward</option>
          <option value="Power Forward">Power Forward</option>
          <option value="Center">Center</option>
        </select>
        <select className="input" defaultValue={searchParams.sort || 'rank'}>
          <option value="rank">Rank</option>
          <option value="games">Games Played</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
}
