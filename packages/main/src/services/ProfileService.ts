import {
  loadSharedConfigFiles,
  DEFAULT_PROFILE,
  ENV_PROFILE,
} from '@smithy/shared-ini-file-loader';

export default {
  /**
   * @param params optional
   * @returns returns stored configs and credentials
   */
  getConfigs() {
    return loadSharedConfigFiles({ ignoreCache: true });
  },
  getDefaultProfile() {
    return DEFAULT_PROFILE;
  },
  getEnvProfile() {
    return ENV_PROFILE;
  },
};
