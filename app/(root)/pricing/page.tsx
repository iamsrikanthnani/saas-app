import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/constants/plans";
import { CircleCheckBig, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Checkout from "@/components/Checkout";
import { getUserById } from "@/lib/actions/user.action";

const Pricing = async () => {
  const { userId } = auth();

  return (
    <SignedIn>
      <div className="m-4">
        <h2 className="text-2xl font-bold tracking-tight">Pricing</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {plans.map((plan) => (
            <Card key={plan.planId}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {plan.name}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{plan.credits} Credits</div>

                <ul className="mb-4 mt-4">
                  {plan.inclusions.map((inclusion, index) => (
                    <li className="flex text-sm font-medium my-2" key={index}>
                      {inclusion.isIncluded ? (
                        <CircleCheckBig className="mr-2" color="green" />
                      ) : (
                        <CircleX className="mr-2" color="red" />
                      )}
                      {inclusion.label}
                    </li>
                  ))}
                </ul>

                {plan.name === "Free plan" ? (
                  <Button disabled className="w-full">
                    Free Consumable
                  </Button>
                ) : (
                  <SignedIn>
                    <Checkout
                      plan={plan.name}
                      amount={plan.price}
                      credits={plan.credits}
                      buyerId={userId!}
                    />
                  </SignedIn>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SignedIn>
  );
};

export default Pricing;
