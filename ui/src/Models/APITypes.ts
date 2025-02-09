export type AlertStateT = "unprocessed" | "active" | "suppressed";

export interface LabelT {
  name: string;
  value: string;
}

export type LabelsT = LabelT[];

export interface AlertmanagerSilenceMatcherT {
  name: string;
  value: string;
  isRegex: boolean;
  isEqual: boolean;
}

export interface AlertmanagerSilencePayloadT {
  id?: string;
  matchers: AlertmanagerSilenceMatcherT[];
  startsAt: string;
  endsAt: string;
  createdBy: string;
  comment: string;
}

export interface APIAnnotationT {
  name: string;
  value: string;
  visible: boolean;
  isLink: boolean;
  isAction: boolean;
}

export interface APIAlertmanagerStateT {
  fingerprint: string;
  name: string;
  cluster: string;
  state: AlertStateT;
  startsAt: string;
  source: string;
  silencedBy: string[];
  inhibitedBy: string[];
}

export interface APIAlertT {
  id: string;
  annotations: APIAnnotationT[];
  labels: LabelsT;
  startsAt: string;
  state: AlertStateT;
  alertmanager: APIAlertmanagerStateT[];
  receiver: string;
}

export interface StateCountT {
  active: number;
  suppressed: number;
  unprocessed: number;
}

export interface APIAlertGroupT {
  id: string;
  receiver: string;
  labels: LabelsT;
  alerts: APIAlertT[];
  totalAlerts: number;
  allLabels: {
    active: { [key: string]: string[] };
    suppressed: { [key: string]: string[] };
    unprocessed: { [key: string]: string[] };
  };
  alertmanagerCount: { [key: string]: number };
  stateCount: StateCountT;
  shared: {
    annotations: APIAnnotationT[];
    labels: LabelsT;
    silences: { [cluster: string]: string[] };
    sources: string[];
    clusters: string[];
  };
}

export interface APISilenceT {
  id: string;
  matchers: AlertmanagerSilenceMatcherT[];
  startsAt: string;
  endsAt: string;
  createdAt: string;
  createdBy: string;
  comment: string;
  ticketID: string;
  ticketURL: string;
}

export interface APIManagedSilenceT {
  alertCount: number;
  cluster: string;
  isExpired: boolean;
  silence: APISilenceT;
}

export interface APIGridT {
  labelName: string;
  labelValue: string;
  alertGroups: APIAlertGroupT[];
  totalGroups: number;
  stateCount: StateCountT;
}

export interface APIAlertmanagerUpstreamT {
  name: string;
  cluster: string;
  uri: string;
  publicURI: string;
  readonly: boolean;
  headers: { [key: string]: string };
  corsCredentials: "omit" | "same-origin" | "include";
  error: string;
  version: string;
  clusterMembers: string[];
}

export interface APIFilterT {
  text: string;
  name: string;
  matcher: string;
  value: string;
  hits: number;
  isValid: boolean;
}

export interface APIAlertsResponseUpstreamsCountersT {
  total: number;
  healthy: number;
  failed: number;
}

export type APIAlertsResponseUpstreamsClusterMapT = {
  [clusterName: string]: string[];
};

export type APIAlertsResponseSilenceMapT = {
  [clusterName: string]: { [silenceID: string]: APISilenceT };
};

export interface APIAlertsResponseAuthenticationT {
  enabled: boolean;
  username: string;
}

export interface APILabelColorT {
  brightness: number;
  background: string;
}
export type APIAlertsResponseColorsT = {
  [labelName: string]: { [labelValue: string]: APILabelColorT };
};

export interface APIAlertsResponseUpstreamsT {
  counters: APIAlertsResponseUpstreamsCountersT;
  instances: APIAlertmanagerUpstreamT[];
  clusters: APIAlertsResponseUpstreamsClusterMapT;
}

export interface APILabelCounterValueT {
  value: string;
  raw: string;
  hits: number;
  percent: number;
  offset: number;
}

export interface APILabelCounterT {
  name: string;
  values: APILabelCounterValueT[];
  hits: number;
}

export interface APILabelSettingsT {
  isStatic: boolean;
  isValueOnly: boolean;
}

export type APILabelsSettingsT = { [key: string]: APILabelSettingsT };

export interface APISettingsT {
  annotationsDefaultHidden: boolean;
  annotationsHidden: string[];
  annotationsVisible: string[];
  annotationsEnableHTML: boolean;
  sorting: {
    grid: {
      order: string;
      reverse: boolean;
      label: string;
    };
    valueMapping: { [labelName: string]: { [labelValue: string]: number } };
  };
  silenceForm: {
    strip: {
      labels: string[];
    };
  };
  alertAcknowledgement: {
    enabled: boolean;
    durationSeconds: number;
    author: string;
    comment: string;
  };
  historyEnabled: boolean;
  gridGroupLimit: number;
  labels: APILabelsSettingsT;
}

export interface APIAlertsResponseT {
  status: string;
  error: string;
  timestamp: string;
  version: string;
  upstreams: APIAlertsResponseUpstreamsT;
  silences: APIAlertsResponseSilenceMapT;
  grids: APIGridT[];
  labelNames: string[];
  totalAlerts: number;
  colors: APIAlertsResponseColorsT;
  filters: APIFilterT[];
  settings: APISettingsT;
  authentication: APIAlertsResponseAuthenticationT;
  receivers: string[];
}

export interface HistorySampleT {
  timestamp: string;
  value: number;
}

export interface HistoryResponseT {
  error: string;
  samples: HistorySampleT[];
}

export interface AlertListResponseT {
  alerts: LabelsT[];
}

export interface CountersResponseT {
  total: number;
  counters: APILabelCounterT[];
}

export interface AlertsRequestT {
  filters: string[];
  gridLabel: string;
  gridLimits: { [key: string]: number };
  gridSortReverse: boolean;
  sortOrder: string;
  sortLabel: string;
  sortReverse: boolean;
  defaultGroupLimit: number;
  groupLimits: { [key: string]: number };
}
