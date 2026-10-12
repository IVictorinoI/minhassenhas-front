import { useQuery } from '@tanstack/react-query'
import { useSession } from '../auth/Session'
import { listPasswords } from '../lib/api'
export function usePasswords() {
    const { user } = useSession()
    return useQuery({
        queryKey: ['passwords', user?.email],
        queryFn: ({ signal }) => listPasswords(signal),
        enabled: !!user,
    })
}
