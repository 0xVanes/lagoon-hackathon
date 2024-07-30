// pages/[slug].js

export async function getStaticPaths() {
    const paths = [
      // Add your dynamic paths here
      { params: { slug: 'path-1' } },
      { params: { slug: 'path-2' } },
    ];
  
    return {
      paths,
      fallback: false, // or true/ 'blocking' based on your requirement
    };
  }
  
  export async function getStaticProps({ params }) {
    // Fetch data based on the slug
    const data = {}; // Your data fetching logic here
  
    return {
      props: {
        data,
      },
    };
  }
  
  const Page = ({ data }) => {
    return (
      <div>
        {/* Your component code here */}
        <h1>{data.title}</h1>
      </div>
    );
  };
  
  export default Page;
  