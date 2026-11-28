// @cap2ui5/agent

/**
 * Mounts the endpoint - called by @cap2ui5/cds-plugin where
 * cds.requires.cap2ui5.agent switches it on; a project does not call it.
 */
export function mount(options: object): { path: string; checkApps(): void } | null;

/**
 * Deletes the agent endpoint's audit rows (cap2ui5.AgentLog) older than
 * `days` - of every user - and answers how many it deleted. `days` defaults to
 * cds.requires.cap2ui5.agent.retention, else 90; 0 or false deletes nothing.
 * The endpoint runs the same DELETE itself at most once an hour; this is for
 * a project that prefers a scheduled job (and sets the retention to 0 so the
 * endpoint leaves the log to it). Runs in cds.context's transaction where
 * there is one - in a multitenant application, call it per tenant inside
 * cds.tx({ tenant }).
 */
export function purgeAgentLog(options?: { days?: number | false; now?: Date }): Promise<number>;
