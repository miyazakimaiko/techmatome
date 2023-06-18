export function successResponse(type: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      type
    }),
  }
}

export function findSuccessResponse(data: any) {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      found: Boolean(data),
      data
    }),
  }
}

export function errorResponse(e: any) {
  return {
    statusCode: e.statusCode ?? 500,
    type: e.type ?? "InternalServerError",
    message: e.message ?? "Unknown error",
  }
}