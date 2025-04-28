import { useSearchParams } from 'next/navigation'

export const useGetParams = type => {
  const searchParams = useSearchParams()
  const mac = searchParams.get(type)

  return mac
}
