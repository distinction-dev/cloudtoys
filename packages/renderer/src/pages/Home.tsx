import React from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const Home: React.FC = () => {
  const query = useQuery();
  return (
    <div className="flex w-full justify-center items-center p-5">
      {query.get('message') ?? 'No log-groups Available !'}
    </div>
  );
};

export default Home;
