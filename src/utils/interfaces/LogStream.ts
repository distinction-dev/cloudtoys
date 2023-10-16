export interface LogStream {
  /**
   * @public
   * <p>The name of the log stream.</p>
   */
  logStreamName?: string
  /**
   * @public
   * <p>The creation time of the stream, expressed as the number of milliseconds after
   *         <code>Jan 1, 1970 00:00:00 UTC</code>.</p>
   */
  creationTime?: number
  /**
   * @public
   * <p>The time of the first event, expressed as the number of milliseconds after <code>Jan 1,
   *         1970 00:00:00 UTC</code>.</p>
   */
  firstEventTimestamp?: number
  /**
   * @public
   * <p>The time of the most recent log event in the log stream in CloudWatch Logs. This number
   *       is expressed as the number of milliseconds after <code>Jan 1, 1970 00:00:00 UTC</code>. The
   *         <code>lastEventTime</code> value updates on an eventual consistency basis. It typically
   *       updates in less than an hour from ingestion, but in rare situations might take
   *       longer.</p>
   */
  lastEventTimestamp?: number
  /**
   * @public
   * <p>The ingestion time, expressed as the number of milliseconds after <code>Jan 1, 1970
   *       00:00:00 UTC</code> The <code>lastIngestionTime</code> value updates on an eventual consistency basis. It
   *       typically updates in less than an hour after ingestion, but in rare situations might take longer.</p>
   */
  lastIngestionTime?: number
  /**
   * @public
   * <p>The sequence token.</p>
   *          <important>
   *             <p>The sequence token is now ignored in
   *       <code>PutLogEvents</code>
   *       actions. <code>PutLogEvents</code> actions are always accepted regardless of receiving an invalid sequence token.
   *     You don't need to obtain <code>uploadSequenceToken</code> to use a <code>PutLogEvents</code> action.</p>
   *          </important>
   */
  uploadSequenceToken?: string
  /**
   * @public
   * <p>The Amazon Resource Name (ARN) of the log stream.</p>
   */
  arn?: string
  /**
   * @public
   * @deprecated
   *
   * <p>The number of bytes stored.</p>
   *          <p>
   *             <b>Important:</b> As of June 17, 2019, this parameter is no
   *       longer supported for log streams, and is always reported as zero. This change applies only to
   *       log streams. The <code>storedBytes</code> parameter for log groups is not affected.</p>
   */
  storedBytes?: number
}
