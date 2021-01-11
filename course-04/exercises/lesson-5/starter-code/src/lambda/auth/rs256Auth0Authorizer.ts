
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken';
import 'source-map-support/register'
import { JwtToken } from '../../auth/JwtToken';

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJAvvxRIdInPj/MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi14eC1zZWxpbS5ldS5hdXRoMC5jb20wHhcNMjEwMTExMjA1MjA3WhcN
MzQwOTIwMjA1MjA3WjAkMSIwIAYDVQQDExlkZXYteHgtc2VsaW0uZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt3jRLd6/FzpXvmYw
HYmuk6+JwITg3VptjXr7ZpPtgHyOuS9IM/QWt/2W6158+uK+72WhfLW0MZ/hwQsN
190ul9i+kHh2Wpkvjp4uzbifTt3tMny2orZsa2dcytDLfmHsMwbuubtQ9di8HJlf
n7knBqDFWqFsSkVGLrX47V+8uH11XPSA0NMaVOPwsiuFY0xICUoyv50NyaOtpzgT
1NaXT378+J5td1U8sfS7UUIxB8oe53WKY82ECdjPHDSqclydANHUVL86FKwc9sDb
PzGxkCYVd3OyplUxFzG9mO3ZBd1/B3DaWM0w6yr19btxFsz4z/gAjkOaUydrJlZC
QUWdzwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQbUZB56XsA
LGLZSI/1J9FvnEqFWTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AF/+LxymeBtEkMhKKQPnVHgEitP4ZtoKqEudM9iO0UYgTJkabOi+X+KRLsktYb3r
z4mi0luh887gim0ANGiBVP4jW70BDX6v//k6qhfUTT9XFFxOjYJkaZ8YrXyZtaBG
t6KGNWocVUY7IBZZ1ayTAEhttra/83Y2dIDaX1QG1HrxuSV34mj0aymsNxTFWeUJ
/qcaMUuOKyggqkFMDcro60HOSxWKVBPTFee/VfB8/7Wr6Q7y6Prbj8Gpo4UrC4hE
s5CVzLDHpgQIQATopfZF6mKBv5VLVRAGuELklNBLPJIJArx6veZu8TY4rcyful2T
nVQTTno7he4yNPDIcbM8yFc=
-----END CERTIFICATE-----`;

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken (event.authorizationToken);
    console.log('User was authorized', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch(e) {
    console.log('User not authorized', e.message);

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }

  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader) {
    throw new Error('No authentication header');
  }

  if (!authHeader.toLocaleLowerCase().startsWith('bearer ')) {
    throw new Error('No authentication header');
  }

  const split = authHeader.split(' ');
  const token = split[1];

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken;
}
