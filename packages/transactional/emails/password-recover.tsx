import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import { env } from '@snipshare/env'
import * as React from 'react'

interface PasswordRecoverEmailProps {
  name: string
  link: string
}

export const PasswordRecoverEmail = ({
  name,
  link,
}: PasswordRecoverEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your SnipShare password</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${env.CLIENT_URL}/logo.png`}
                width="40"
                height="40"
                alt="SnipShare logo"
                className="mx-auto my-0 rounded-full"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Reset your password on <strong>SnipShare</strong>
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              Hi {name},
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              Someone recently requested a password reset for your SnipShare
              account. If this was you, you can set a ne password here:
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Reset password
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This password reset was intended for{' '}
              <span className="text-black">{name}</span>. If you were not
              expecting this email, you can ignore and delete this email. If you
              are concerned about your account's safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

PasswordRecoverEmail.PreviewProps = {
  name: 'Jane Doe',
  link: 'https://snipshare.co',
} as PasswordRecoverEmailProps

export default PasswordRecoverEmail
