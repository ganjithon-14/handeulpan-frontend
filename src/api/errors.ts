import { isAxiosError } from 'axios';

/**
 * 백엔드 에러 코드 (docs/api/common.md).
 * 분기는 message가 아니라 이 code로 한다.
 * NETWORK_ERROR, UNKNOWN_ERROR는 프론트에서 붙이는 값이다.
 */
export const ERROR_CODE = {
    INVALID_DEVICE_TOKEN: 'INVALID_DEVICE_TOKEN',
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
    PASTURE_NOT_FOUND: 'PASTURE_NOT_FOUND',
    SHEEP_NOT_FOUND: 'SHEEP_NOT_FOUND',
    NOT_PASTURE_MEMBER: 'NOT_PASTURE_MEMBER',
    NOT_MY_SHEEP: 'NOT_MY_SHEEP',
    PASTURE_FULL: 'PASTURE_FULL',
    ALREADY_JOINED: 'ALREADY_JOINED',
    BUBBLE_TEXT_INVALID: 'BUBBLE_TEXT_INVALID',
    BUBBLE_NOT_FOUND: 'BUBBLE_NOT_FOUND',
    ALREADY_SENT_TODAY: 'ALREADY_SENT_TODAY',
    SELF: 'SELF',
    SCARF_NOT_FOUND: 'SCARF_NOT_FOUND',
    INVALID_DEMO_KEY: 'INVALID_DEMO_KEY',
    DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
    DUPLICATE_NICKNAME: 'DUPLICATE_NICKNAME',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

/** 모든 API 실패는 이 형태로 던진다. 화면에서는 `error.code`로 분기한다. */
export class ApiError extends Error {
    /** HTTP 상태. 응답을 못 받았으면 0 */
    readonly status: number;
    /** 백엔드가 모르는 새 코드를 보낼 수도 있어서 string으로 둔다 */
    readonly code: ErrorCode | (string & {});

    constructor(status: number, code: string, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

/** 백엔드 에러 본문 { code, message } 인지 확인 */
function isErrorBody(data: unknown): data is { code: string; message?: string } {
    return (
        typeof data === 'object' && data !== null && typeof Reflect.get(data, 'code') === 'string'
    );
}

/** axios 에러 등 무엇이 오든 ApiError로 바꾼다 */
export function toApiError(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError(error)) {
        const response = error.response;
        // 응답 자체를 못 받음: 오프라인, CORS 차단, 타임아웃
        if (!response) {
            return new ApiError(0, ERROR_CODE.NETWORK_ERROR, '네트워크 연결을 확인해 주세요.');
        }
        if (isErrorBody(response.data)) {
            return new ApiError(
                response.status,
                response.data.code,
                response.data.message ?? '요청을 처리하지 못했어요.',
            );
        }
        return new ApiError(response.status, ERROR_CODE.UNKNOWN_ERROR, '요청을 처리하지 못했어요.');
    }

    return new ApiError(0, ERROR_CODE.UNKNOWN_ERROR, '알 수 없는 오류가 났어요.');
}
