import * as admin from 'firebase-admin';

const FIREBASE_CONFIG = {
  type: 'service_account',
  project_id: 'test-18476',
  private_key_id: '5a9d359ee6efb2fab5d22456f5e0cb745c41e5f1',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDOC0igPSiAZzW8\nL6/c6Gx9m17bdHZ8fiZuzZmtSfaQZgZAK3pYAXpVx4aQkIcEyyIr3aHtlfxmCB50\nhNs86mDh8GboAi9kyFO5aLikNSIXdHeYiGdGjEXMHvVZwJRrZ+5KTQqeDduQx5qJ\nfOlCq0Sa4Hhke2YmVBIAqzXhgTKMJsIJZBnNUj9gMA8NKcrlysCPmm+t86E4ErV/\nn0UGY1P+gs5pQjEbMuWTsRNyFOtJziIdY2PAHf+1CtfvwdUUi2seVJuHV35VYcnG\naX/pKn2jBdr5Kt2fD/wVcRcW2w2E5eydzLGKW01mqd+/ws3nAIL9APZdpwQeuQ1w\nyVVMjsMPAgMBAAECggEAMuR3mliw1dJoY+SVeCeSkI3dZrBECejw3kJ7WGGh/LWu\nipASpoUq7eAcHT4Nk4IHHTWfpvr6fks4FoiwTEIKDxSdnmXXxflzMKMspCaZlpiG\nZ88dT0Abh1kIOhSGtGbV5VVVL4f1uTOMOLR5OyXpiqWyJwORzhrK3Y5sfxg134bL\nxnd1NgaGESNqKNDQJBuQ2oQd6WA6VCGRb7U7+MKE0CQp2h5Ul1wGmYSyNN6NMzeY\n3CX7uPXLzg1D99YCgWaIbye5madON03IrhRDAcXBkEIc9jnus5clzXNgeXVG5WMq\nkP4y73dETQ1WQdrBiGKFbngjVWPyvyUD4iHJxDViuQKBgQDmnp4Ogz26OmpPGV/B\ndkDQYFhZ9SvwMUdRo52/DO1ljk11GzHZo+xdM5CLJ81+Xu8xoVxIp1A7oTrRIEyH\n/s4Tefg/W3zJ9GxLTfvHhDxTMIqEG2zqi1YVMmlAgrUnQwLBOBaZZ+hzmb+wSlga\ny2JDPbFM8JEY62NQrbpqgc3RJwKBgQDkuEkY9BmYXBypnEVwfkZa1mNYILIwL8ek\nFBL84I1+fdtY///uPXB9XCETDhGHKFyL0//VSK6xnb04/yPJcew4Oyq+0TbJn8BJ\nK1M4sLPBxQgWH5qWzE87z2DH9e0adYFnaVYp4kkKXL04KV8qJIdkTZY21SJAhOst\neouX/o1f2QKBgAZJzu+AXp+EVj+/5l+FFPFZny8cw0zyWwp71qJN/O8m+S+3RR21\nHY3RCSDyPeUzO3xz9Os6PLLTi6IGKnAO35miWsWHfhiXpJhNEQ94qJhwG2bMxKSE\nlh1P2ZTbu4rNhfa0y9D1B16Xk6V/8XURlKVWuk3pxVsTmAqsIggjb/RDAoGAOLt9\nZjMmJiSy919L2ht4WA/VlIaHrGwtmQVhsFgCwN13Cxx03yNeQ7oWeiODNYNNcWGk\nk8LzkhsOVJT0y4L2lPwYHjzG2jxF9eBJREaQUAAPgW1VaxJClRNbbj4SEf4TmxMF\nzF3UwD1Asi2Q7WMiMj8Mg41acaaGr0E2Xv1FFAECgYEAvk6GL2hVKeAYLylgX6cB\n/Mqz3Td2UgkWK7od6UStP3lXruc7C8QVlQ26bB4y9z/lRj6rgCdgZMBtgnzKJKZg\nxXcbi46NUDU3bqVet16CB9oFwfiDjQWRfPJaUU80rAphZFxUnpQCxIupXzmOFvPm\nO4r9l5E+19+4/bAxG6OlRvk=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-fbsvc@test-18476.iam.gserviceaccount.com',
  client_id: '106805673649059048551',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40test-18476.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
export const firebaseServiceAccount: admin.ServiceAccount = {
  clientEmail: FIREBASE_CONFIG.client_email,
  privateKey: FIREBASE_CONFIG.private_key.replace(/\\n/g, '\n').trim(),
  projectId: FIREBASE_CONFIG.project_id,
};
