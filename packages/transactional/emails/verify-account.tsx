import {
  Body,
  Button,
  Container,
  Head,
  Heading,
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

interface VerifyAccountEmailProps {
  name: string
  link: string
}

export const VerifyAccountEmail = ({ name, link }: VerifyAccountEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your Snipshare account</Preview>
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
              Verify your <strong>Snipshare</strong> account
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              Hi {name},
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              Thank you for giving Snipshare a try! We are excited to welcome
              you aboard. To make the most of your Snipshare experience, please
              follow this initial step:
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Verify my account
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

VerifyAccountEmail.PreviewProps = {
  name: 'Jane Doe',
  link: 'https://snipshare.co',
} satisfies VerifyAccountEmailProps

export default VerifyAccountEmail
