import { getCurrentOrgSlug } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getBilling } from '@/http/get-billing'
import { formatCurrency } from '@/lib/utils'

export async function Billing() {
  const currentOrgSlug = getCurrentOrgSlug()
  const { billing } = currentOrgSlug
    ? await getBilling(currentOrgSlug)
    : { billing: undefined }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          Information about your organization's costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cost type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right" style={{ width: 200 }}>
                Subtotal
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>Amount of projects</TableCell>
              <TableCell className="text-right">
                {billing?.projects.amount}
              </TableCell>
              <TableCell className="text-right">
                {billing && (
                  <>
                    {formatCurrency(billing.projects.price)} (
                    {formatCurrency(billing.projects.unit)} each)
                  </>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount of seats</TableCell>
              <TableCell className="text-right">
                {billing?.seats.amount}
              </TableCell>
              <TableCell className="text-right">
                {billing && (
                  <>
                    {formatCurrency(billing.seats.price)} (
                    {formatCurrency(billing.seats.unit)} each)
                  </>
                )}
              </TableCell>
            </TableRow>
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell className="text-right">Total</TableCell>
              <TableCell className="text-right">
                {billing?.total && formatCurrency(billing.total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
