'use client';

import fetchBoard from '@/lib/fetchBoard';
import useUserStore from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';

type Props = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Props) => {
  const [userData] = useUserStore((state) => [state.userData]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [boardId],
    queryFn: () => fetchBoard(userData?.uid!, boardId),
    enabled: !!userData && !!boardId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
      <h1 className="text-4xl font-bold text-center w-full">{data?.name}</h1>
    </main>
  );
};

export default Board;
