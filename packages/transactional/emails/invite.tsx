import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import { env } from '@snipshare/env'
import * as React from 'react'

interface InviteEmailProps {
  invitee: {
    email: string
  }
  author: {
    name: string
    email: string
  }
  organization: {
    name: string
    avatarUrl: string | null
  }
  invite: {
    link: string
  }
}

export const InviteEmail = ({
  invitee,
  author,
  organization,
  invite,
}: InviteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Join {organization.name} on Snipshare</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${env.CLIENT_URL}/logo.png`}
                width="40"
                height="40"
                alt="Snipshare logo"
                className="mx-auto my-0 rounded-full"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{organization.name}</strong> on{' '}
              <strong>Snipshare</strong>
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              Hello,
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{author.name}</strong> (
              <Link
                href={`mailto:${author.email}`}
                className="text-blue-600 no-underline"
              >
                {author.email}
              </Link>
              ) has invited you to the <strong>{organization.name}</strong>{' '}
              organization on <strong>Snipshare</strong>.
            </Text>

            {organization.avatarUrl && (
              <Section>
                <Row>
                  <Column align="center">
                    <Img
                      className="rounded-full"
                      src={organization.avatarUrl}
                      width="64"
                      height="64"
                    />
                  </Column>
                </Row>
              </Section>
            )}

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={invite.link}
              >
                Join the organization
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={invite.link} className="text-blue-600 no-underline">
                {invite.link}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{' '}
              <span className="text-black">{invitee.email}</span>. If you were
              not expecting this invitation, you can ignore this email. If you
              are concerned about your account's safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

InviteEmail.PreviewProps = {
  invitee: {
    email: 'janedoe@email.com',
  },
  author: {
    email: 'johndoe@email.com',
    name: 'John Doe',
  },
  organization: {
    name: 'Snipshare',
    avatarUrl: 'https://loremflickr.com/640/480',
  },
  invite: {
    link: 'https://snipshare.co',
  },
} satisfies InviteEmailProps

export default InviteEmail
