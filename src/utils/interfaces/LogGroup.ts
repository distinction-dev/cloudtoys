export interface LogGroup {
  subscriptionFilterCount?: number
  /**
   * @public
   * <p>The name of the log group.</p>
   */
  logGroupName?: string
  /**
   * @public
   * <p>The creation time of the log group, expressed as the number of milliseconds after Jan
   *       1, 1970 00:00:00 UTC.</p>
   */
  creationTime?: number
  /**
   * @public
   * <p>The number of days to retain the log events in the specified log group.
   *       Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1096, 1827, 2192, 2557, 2922, 3288, and 3653.</p>
   *          <p>To set a log group so that its log events do not expire, use <a href="https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_DeleteRetentionPolicy.html">DeleteRetentionPolicy</a>. </p>
   */
  retentionInDays?: number
  /**
   * @public
   * <p>The number of metric filters.</p>
   */
  metricFilterCount?: number
  /**
   * @public
   * <p>The Amazon Resource Name (ARN) of the log group.</p>
   */
  arn?: string
  /**
   * @public
   * <p>The number of bytes stored.</p>
   */
  storedBytes?: number
  /**
   * @public
   * <p>The Amazon Resource Name (ARN) of the KMS key to use when
   *       encrypting log data.</p>
   */
  kmsKeyId?: string
}
