import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";

const BuyOurServices = async () => {
  const user = await currentUser();

  if (!user) return <div>Sign in to view this page</div>;

  return (
    <div>Now you can buy out Services {user.firstName || "friend"}!

<div className="p-4"> 
     
      <Button>Buy</Button>
    </div> 
    </div>
)
}

export default BuyOurServices
