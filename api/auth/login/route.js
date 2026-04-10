export async function POST(request) {
  try {
    const body = await request.json()
    const { countryCode, phone } = body

    if (!countryCode || !phone) {
      return Response.json(
        { success: false, message: 'Country code and phone are required' },
        { status: 400 }
      )
    }

    // Mock success - OTP sent
    return Response.json({
      success: true,
      message: 'OTP sent successfully',
      demoOtp: '1111' // For testing purposes
    })
  } catch (error) {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
