import { GetStaticProps } from 'next'

export const getDefaultStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    // Revalidate every hour
    revalidate: 3600,
  }
}

export const getDynamicStaticProps = (revalidateTime = 3600) => {
  const getStaticProps: GetStaticProps = async () => {
    return {
      props: {},
      revalidate: revalidateTime,
    }
  }
  return getStaticProps
}

export const getStaticPathsForRooms = async () => {
  // This would typically fetch from your API/database
  const paths = Array.from({ length: 9 }, (_, i) => ({
    params: { roomId: (100 + i).toString() },
  }))

  return {
    paths,
    fallback: 'blocking', // Show a loading state for new paths
  }
} 