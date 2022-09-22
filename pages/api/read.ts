import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';


interface ReportCardResponse {
  meta: {
    assessmentTestCode: string,
    dataNotAvailableMessage: any,
    groupType: string,
    startFiscalYear: string,
    endFiscalYear: string,
    grade: string,
    orgId: string,
    subject: string,
    demographicCategoryCodes: string,
  },
  dataSets: [
    { assessment: object },
    { participation: object },
    { hsScienceParticipation: object },
    { MCA_MTAS: object }
  ]
}

const getPayload = (d: ReportCardResponse): object => {
  if (d.meta.dataNotAvailableMessage != null) {
    return { msg: 'Data not available' };
  }

  const payload = {
    assessment: d.dataSets[0].assessment,
    participation: d.dataSets[1].participation,
    hsScienceParticipation: d.dataSets[2].hsScienceParticipation,
    MCA_MTAS: d.dataSets[3].MCA_MTAS
  };
  
  return payload;
}

const orgMap = new Map([
  ["Stillwater Area High School", '10834047000'],
  ['Forest Lake Area High School', '10831114000']
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { subject, year, grade, school } = req.query;

  if (typeof subject !== 'string' || typeof year !== 'string' || typeof grade !== 'string' || typeof school !== 'string') {
    res.status(400).json({ msg: 'bad request' });
    return;
  }

  const base = "https://rc.education.mn.gov/";
  const path = "ibi_apps/WFServlet";
  let url = new URL(`${base}${path}?`);

  url.searchParams.set('IBIAPP_app', 'rptcard_reports');
  url.searchParams.set('IBIF_ex', 'rptcard_getdata_stateassessments');

  url.searchParams.set('orgName', school);
  url.searchParams.set('orgId', orgMap.get(school) || '');

  url.searchParams.set('test', 'allAccount');
  url.searchParams.set('accountabilityFlg', 'FOC_NONE');

  url.searchParams.set('subject', subject);
  url.searchParams.set('year', year);
  url.searchParams.set('grade', grade);

  try {
    const resp = await axios.get(url.toString());
    const payload = getPayload(resp.data);
    res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: 'couldnt find' })
  }
}
