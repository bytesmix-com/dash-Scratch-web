import { ClientError } from "graphql-request";
import _ from "lodash";

import defaultRequestErrorHandler from "./default-request-error-handler";

interface CodeHandler {
  code: string;
  onError: (error?: ClientError) => void;
}

// 특정 에러 코드에 기본 error handler가 아닌 다른 에러 처리를 적용할 때 사용합니다.
// 지정한 에러 코드가 아닐 경우 기본 error handler가 적용됩니다.
const handleErrorCodes = (error: ClientError, codeHandlers: CodeHandler[]) => {
  if (!error?.response?.errors) {
    defaultRequestErrorHandler(error);
    return;
  }

  const { code } = error.response.errors[0].extensions;

  const handler = _.find(codeHandlers, { code });

  if (!handler) {
    defaultRequestErrorHandler(error);
    return;
  }

  handler.onError(error);
};

export default handleErrorCodes;
