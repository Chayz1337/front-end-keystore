import Heading from "@/src/components/ui/button/Heading";
import Layout from "@/src/components/ui/layout/Layout";
import Meta from "@/src/components/ui/Meta";
import { NextPage } from "next";

const ThanksPage: NextPage = () => {
    return (
      <Meta title="Thanks">
        <Layout>
          <Heading>Thanks!</Heading>
        </Layout>
      </Meta>
    );
  };
  
  export default ThanksPage;