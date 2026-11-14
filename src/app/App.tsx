import { RouterProvider } from 'react-router/dom';

import { router } from '@/app/router';

/** 앱 진입. 전역 Provider가 생기면 여기서 RouterProvider를 감싼다. */
export function App() {
    return <RouterProvider router={router} />;
}
