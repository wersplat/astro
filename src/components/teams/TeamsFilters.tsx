type SearchParamsType = {
  search?: string;
  sort?: string;
  page?: string;
};

export default function TeamsFilters({ searchParams }: { searchParams: SearchParamsType }) {
  return (
    <div className="paper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search teams..." 
          className="input"
          defaultValue={searchParams.search}
        />
        <select className="input" defaultValue={searchParams.sort || 'rank'}>
          <option value="rank">Rank</option>
          <option value="wins">Wins</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
}
