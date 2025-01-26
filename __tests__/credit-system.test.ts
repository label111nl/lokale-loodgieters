import { deductCredits } from "@/utils/credit-management"
import { checkAndNotifyLowCredits } from "@/utils/notifications"
import { expireCredits } from "@/utils/credit-expiration"
import { processRefund } from "@/utils/refund-process"
import { createClient } from "@supabase/supabase-js"

jest.mock("@supabase/supabase-js")
jest.mock("@/utils/stripe-server")

describe("Credit System", () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      rpc: jest.fn(),
    }
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  test("deductCredits should handle premium subscriptions", async () => {
    mockSupabase.single.mockResolvedValue({ data: { subscription_type: "premium" } })

    const result = await deductCredits("plumber123", 5, "Test deduction")
    expect(result).toEqual({ creditsUsed: 0, remainingCredits: "unlimited" })
  })

  test("checkAndNotifyLowCredits should create notification for low credits", async () => {
    mockSupabase.single.mockResolvedValue({
      data: { credits: 3, email: "test@example.com", subscription_type: "standard" },
    })

    await checkAndNotifyLowCredits("plumber123")

    expect(mockSupabase.insert).toHaveBeenCalledWith({
      user_id: "plumber123",
      type: "low_credits",
      message: expect.any(String),
    })
  })

  test("expireCredits should expire credits older than 90 days", async () => {
    const mockExpiredCredits = [
      { id: "credit1", plumber_id: "plumber123", amount: 10 },
      { id: "credit2", plumber_id: "plumber456", amount: 5 },
    ]
    mockSupabase.select.mockResolvedValue({ data: mockExpiredCredits })

    await expireCredits()

    expect(mockSupabase.rpc).toHaveBeenCalledTimes(2)
    expect(mockSupabase.rpc).toHaveBeenCalledWith("expire_credits", {
      p_plumber_id: "plumber123",
      p_amount: 10,
      p_transaction_id: "credit1",
    })
  })

  test("processRefund should create a refund and adjust credits", async () => {
    mockSupabase.single.mockResolvedValue({ data: { stripe_customer_id: "cus_123" } })
    mockSupabase.rpc.mockResolvedValue({ data: 95 }) // Remaining credits after refund

    const result = await processRefund("plumber123", 5, "Customer request")

    expect(result).toEqual({ success: true, refundId: expect.any(String) })
    expect(mockSupabase.insert).toHaveBeenCalled()
    expect(mockSupabase.rpc).toHaveBeenCalledWith("adjust_credits", {
      p_plumber_id: "plumber123",
      p_amount: -5,
    })
  })
})

