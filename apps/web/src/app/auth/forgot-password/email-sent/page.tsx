import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordEmailSentPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>We've just emailed you</CardTitle>
      </CardHeader>

      <CardContent>
        Please check your inbox and follow the instructions provided to reset
        your password.
        <br />
        <br />
        Feel free to close this page at your convenience.
      </CardContent>
    </Card>
  )
}
