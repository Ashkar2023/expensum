import { ReceiptIndianRupee } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"
import { Button } from "./ui/button"

export const OtpForm = () => {
    return (
        <div className="max-w-[200px] place-items-center space-y-4">
            <div className="place-items-center">
                <ReceiptIndianRupee className="text-brand" size="4rem" />
                <h3 className="text-2xl font-bold text-center">Expensum</h3>
            </div>
            
            <hr className=" w-full" />
            
            <h3 className="text-center text-xs text-muted/70">Enter OTP & Verify account</h3>
            <InputOTP maxLength={4}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
            </InputOTP>

            <Button className=" hover:bg-secondary">Verify</Button>
        </div>
    )
}