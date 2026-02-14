import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Application } from '../backend';

export function useGetOwnApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<Application[]>({
    queryKey: ['ownApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOwnApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetApplicationById(applicationNumber: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Application>({
    queryKey: ['application', applicationNumber],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getApplicationById(applicationNumber);
    },
    enabled: !!actor && !isFetching && !isNaN(applicationNumber),
  });
}
