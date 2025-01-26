import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { loadStripe } from "@stripe/stripe-js"
import { processRefund } from "@/utils/refund-process"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const creditPacks = [
  { credits: 1, price: 35, discount: 0 },
  { credits: 5, price: 150, discount: 25 },
  { credits: 10, price: 300, discount: 50 },
  { credits: 15, price: 425, discount: 100 },
]

export function CreditSystem({ plumberId, currentCredits, subscriptionType, subscriptionEndDate, isAdmin = false }) {
  const [selectedPack, setSelectedPack] = useState(creditPacks[0])
  const [refundAmount, setRefundAmount] = useState(0)
  const [refundReason, setRefundReason] = useState("")
  const supabase = createClientComponentClient()

  const buyCredits = async () => {
    const stripe = await stripePromise

    const response = await fetch("/api/create-credit-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ packId: selectedPack.credits, plumberId }),
    })

    const { sessionId } = await response.json()

    const result = await stripe!.redirectToCheckout({
      sessionId: sessionId,
    })

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      })
    }
  }

  const handleRefund = async () => {
    try {
      await processRefund(plumberId, refundAmount, refundReason)
      toast({
        title: "Success",
        description: "Refund processed successfully",
      })
      setRefundAmount(0)
      setRefundReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      })
    }
  }

  const { data: creditTransactions } = supabase
    .from("credit_transactions")
    .select("*")
    .eq("plumber_id", plumberId)
    .order("created_at", { ascending: false })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit System</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Current credits: {currentCredits}</p>
        <p>Subscription type: {subscriptionType}</p>
        {subscriptionType === "monthly" && (
          <p>Subscription expires on: {new Date(subscriptionEndDate).toLocaleDateString()}</p>
        )}
        {currentCredits <= 1 && (
          <p className="text-red-500 font-bold mt-2">
            Warning: You have 1 or fewer credits left. Please purchase more credits to continue responding to leads.
          </p>
        )}
        <div className="mt-4 space-y-2">
          {creditPacks.map((pack) => (
            <div key={pack.credits} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`pack-${pack.credits}`}
                name="creditPack"
                value={pack.credits}
                checked={selectedPack.credits === pack.credits}
                onChange={() => setSelectedPack(pack)}
              />
              <label htmlFor={`pack-${pack.credits}`}>
                {pack.credits} credit{pack.credits > 1 ? "s" : ""} for €{pack.price} (Save €{pack.discount})
              </label>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Credit Transactions</h3>
          <ul className="space-y-2">
            {creditTransactions?.map((transaction) => (
              <li key={transaction.id}>
                {transaction.type === "purchase" && `Purchased ${transaction.amount} credits`}
                {transaction.type === "usage" && `Used ${transaction.amount} credits`}
                {transaction.type === "expiration" && `${transaction.amount} credits expired`}
                {transaction.type === "refund" && `Refunded ${transaction.amount} credits`}
                {" - "}
                {new Date(transaction.created_at).toLocaleString()}
                {transaction.type === "purchase" && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Expires:{" "}
                    {new Date(
                      new Date(transaction.created_at).getTime() + 90 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                    )
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        {isAdmin && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Process Refund</h3>
            <div className="space-y-2">
              <Label htmlFor="refundAmount">Refund Amount</Label>
              <Input
                id="refundAmount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
              />
              <Label htmlFor="refundReason">Refund Reason</Label>
              <Input id="refundReason" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
              <Button onClick={handleRefund}>Process Refund</Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={buyCredits}>Buy Credits</Button>
      </CardFooter>
    </Card>
  )
}

