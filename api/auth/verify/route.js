export async function POST(request) {
  try {
    const body = await request.json()
    const { countryCode, phone, otp } = body

    if (!countryCode || !phone || !otp) {
      return Response.json(
        { success: false, message: 'Country code, phone and OTP are required' },
        { status: 400 }
      )
    }

    // Mock OTP verification - accept "1111" as valid
    if (otp !== '1111') {
      return Response.json(
        { success: false, message: 'Invalid OTP' },
        { status: 401 }
      )
    }

    // Mock successful authentication response
    return Response.json({
      success: true,
      user: {
        id: '69b55fe07b825b956a6f699e',
        name: 'عبدالله عمر',
        phone: `${countryCode}${phone}`,
        role: 'admin'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjU1ZmUwN2I4MjViOTU2YTZmNjk5ZSIsInJvbGUiOiJhZG1pbiIsInZlcnNpb24iOjAsImlhdCI6MTc3NTgyNjc3MywiZXhwIjoxNzc2NDMxNTczfQ.SjnJ8wb0Xr_4hftpKGRVyS7fle_bhmu_lH2WT_yZDf0',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjU1ZmUwN2I4MjViOTU2YTZmNjk5ZSIsInR5cGUiOiJyZWZyZXNoIiwidmVyc2lvbiI6MCwiaWF0IjoxNzc1ODI2NzczLCJleHAiOjE3Nzg0MTg3NzN9.7idTluEHDrlyHfFyfwKTJNZru6kAgJdfaLIvQ5H-B_M'
    })
  } catch (error) {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
