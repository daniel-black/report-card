import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react';
import axios from 'axios';

interface Payload {
  assessment: AssessmentData,
  participation: ParticipationData,
  hsScienceParticipation: HsScieneParticipationData,
  MCA_MTAS: MCA_MTASData
}

interface AssessmentData {
  data: {
    district: [AssessmentResults],
    school: [AssessmentResults],
    state: [AssessmentResults],
  },
  endFiscalYear: string,
  startFiscalYear: string,
  meta: {
    dataNotAvailableMessage: string | null,
  },
}

interface ParticipationData {
  data: {
    district: [ParticipationResults],
    school: [ParticipationResults],
    state: [ParticipationResults],
  },
  endFiscalYear: string,
  startFiscalYear: string,
  meta: {
    dataNotAvailableMessage: string | null,
  },
}

interface HsScieneParticipationData {
  data: {
    district: [HsScieneParticipationResults],
    school: [HsScieneParticipationResults],
    state: [HsScieneParticipationResults],
  },
  endFiscalYear: string,
  startFiscalYear: string,
  meta: {
    dataNotAvailableMessage: string | null,
  },
}

interface MCA_MTASData {
  data: {
    doesNotMeet: [MCA_MTASResults],
    exceeds: [MCA_MTASResults],
    meets: [MCA_MTASResults],
    partiallyMeets: [MCA_MTASResults],
  },
  endFiscalYear: string,
  startFiscalYear: string,
  meta: {
    dataNotAvailableMessage: string | null,
  },
}


interface AssessmentResults {
  fiscalYear: number,
  organizationName: string,
  proficientCountDisplay: string,
  proficientPercent: number,
  proficientPercentDisplay: string,
  testedCountDisplay: string,
}

interface ParticipationResults {
  fiscalYear: number,
  organizationName: string,
  testedPercentDisplay: string,
  testedPercent: number,
  testedCountDisplay: string,
  expectedTestedCountDisplay: string,
  mtasTakingPercentDisplay: string
}

interface HsScieneParticipationResults {
  fiscalYear: number,
  organizationName: string,
  testedPercentDisplay: string,
  testedPercent: number,
  testedCountDisplay: string,
  cohortCountDisplay: string,
}

interface MCA_MTASResults {
  achievementLevelDisplay: string,
  fiscalYear: string,
  subjectDisplay: string,
  countDisplay: string,
  percent: number,
  percentDisplay: string,
  testCountDisplay: string,
}

const Home: NextPage = () => {
  const [year, setYear] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [school, setSchool] = useState<string>('');

  const [results, setResults] = useState<Payload | null>(null);

  const searchForReportCard = async () => {
    const schoolString = school.replaceAll(' ', '+');
    const qs = `year=${year}&grade=${grade}&subject=${subject}&school=${schoolString}`;

    try {
      const response = await axios.get(`/api/read?${qs}`);
      if (response.status === 200) {
        console.dir(response.data)
        setResults(response.data);
        return response.data;
      }
      return new Error('something not work');
    } catch (err) {
      throw err;
    }
  }


  const renderResults = () => {
    if (!results) {
      return <h2 className='text-white text-2xl text-center'>No results... Search for something</h2>;
    }
    return(
      <div className='text-white space-y-4'>
        {renderAssessments()}
        {renderParticipation()}
        {renderHsScienceParticipation()}
        {renderMCA_MTAS()}
      </div>
    )
  }

  const renderAssessments = () => {
    if (results?.assessment.meta.dataNotAvailableMessage != null) {
      return <p>No assessment data</p>;
    }
    const d = results?.assessment.data;
    return(
      <div className='text-white bg-zinc-500 p-2 rounded-xl space-y-2'>
        <h2 className='text-xl'>Assessment</h2>
        <div className='flex space-x-2'>
          <div className='bg-zinc-600 p-2 rounded-lg w-80'>
            <h4 className='font-bold'>School</h4>
            <p>{d?.school[0].organizationName}</p>
            <p>{d?.school[0].proficientCountDisplay} proficient / {d?.school[0].testedCountDisplay} tested</p>
            <p>percent proficient: {d?.school[0].proficientPercentDisplay}</p>
          </div>
          <div className='bg-zinc-600 p-2 rounded-lg w-80'>
            <h4 className='font-bold'>District</h4>
            <p>{d?.district[0].organizationName}</p>
            <p>{d?.district[0].proficientCountDisplay} proficient / {d?.district[0].testedCountDisplay} tested</p>
            <p>percent proficient: {d?.district[0].proficientPercentDisplay}</p>
          </div>
          <div className='bg-zinc-600 p-2 rounded-lg w-80'>
            <h4 className='font-bold'>State</h4>
            <p>{d?.state[0].organizationName}</p>
            <p>{d?.state[0].proficientCountDisplay} proficient / {d?.state[0].testedCountDisplay} tested</p>
            <p>percent proficient: {d?.state[0].proficientPercentDisplay}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderParticipation = () => {
    if (results?.participation.meta.dataNotAvailableMessage != null) {
      return <p>No participation data</p>;
    }
    const d = results?.participation.data;
    return(
      <div className='text-white bg-zinc-500 p-2 rounded-xl space-y-2'>
        <h2 className='text-xl'>Participation</h2>
        <div className='flex space-x-2'>
          <div className='bg-zinc-600 p-2 rounded-lg w-80'>
            <h4 className='font-bold'>School</h4>
            <p>{d?.school[0].organizationName}</p>
            <p>{d?.school[0].testedCountDisplay} tested / {d?.school[0].expectedTestedCountDisplay} expected tested</p>
            <p>percent tested: {d?.school[0].testedPercentDisplay}</p>
          </div>
          <div className='bg-zinc-600 p-2 rounded-lg w-80'>
            <h4 className='font-bold'>District</h4>
            <p>{d?.district[0].organizationName}</p>
            <p>{d?.district[0].testedCountDisplay} tested / {d?.district[0].expectedTestedCountDisplay} expected tested</p>
            <p>percent tested: {d?.district[0].testedPercentDisplay}</p>
          </div>
          <div className='bg-zinc-600 p-2 rounded-lg w-80'>
            <h4 className='font-bold'>State</h4>
            <p>{d?.state[0].organizationName}</p>
            <p>{d?.state[0].testedCountDisplay} tested / {d?.state[0].expectedTestedCountDisplay} expected tested</p>
            <p>percent tested: {d?.state[0].testedPercentDisplay}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderHsScienceParticipation = () => {
    if (results?.hsScienceParticipation.meta.dataNotAvailableMessage != null) {
      return <p>No HS Science Participation data</p>;
    }
    const d = results?.hsScienceParticipation.data;
    return(
      <div>
        <div><h4 className='font-bold'>School</h4></div>
        <div><h4 className='font-bold'>District</h4></div>
        <div><h4 className='font-bold'>State</h4></div>
      </div>
    );
  }

  const renderMCA_MTAS = () => {
    if (results?.MCA_MTAS.meta.dataNotAvailableMessage != null) {
      return <p>No MCA MTAS data</p>;
    }
    const d = results?.MCA_MTAS.data;
    return(
      <div className='text-white bg-zinc-500 p-2 rounded-xl space-y-2'>
        <h2 className='text-xl'>MCA MTAS - {d?.meets[0].subjectDisplay}</h2>
        <h3>{d?.meets[0].testCountDisplay} Total Tests</h3>
        <div className='flex space-x-2 text-zinc-900'>
          <div className='bg-green-500 p-2 rounded-lg w-80'>
            <p>{d?.exceeds[0].achievementLevelDisplay} ({d?.exceeds[0].countDisplay})</p>
            <p className='text-4xl text-center font-bold py-4'>{d?.exceeds[0].percentDisplay}</p>
          </div>
          <div className='bg-lime-300 p-2 rounded-lg w-80'>
            <p>{d?.meets[0].achievementLevelDisplay} ({d?.meets[0].countDisplay})</p>
            <p className='text-4xl text-center font-bold py-4'>{d?.meets[0].percentDisplay}</p>
          </div>
          <div className='bg-amber-300 p-2 rounded-lg w-80'>
            <p>{d?.partiallyMeets[0].achievementLevelDisplay} ({d?.partiallyMeets[0].countDisplay})</p>
            <p className='text-4xl text-center font-bold py-4'>{d?.partiallyMeets[0].percentDisplay}</p>
          </div>
          <div className='bg-red-600 p-2 rounded-lg w-80'>
            <p>{d?.doesNotMeet[0].achievementLevelDisplay} ({d?.doesNotMeet[0].countDisplay})</p>
            <p className='text-4xl text-center font-bold py-4'>{d?.doesNotMeet[0].percentDisplay}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen bg-zinc-900'>
      <Head>
        <title>Report Card</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex flex-col items-center w-full'>

        <div className='bg-zinc-700 flex justify-between p-5 w-full'>
          <div className='flex space-x-5'>
            <div>
              <h3 className='text-zinc-50 font-bold'>School</h3>
              <select className='w-full p-1 rounded' name="school" onChange={(e) => setSchool(e.currentTarget.value)}>		
                <option value="Forest Lake Area High School">Forest Lake Area High School</option>
                <option value="Stillwater Area High School">Stillwater Area High School</option>
              </select>
            </div>

            <div>
              <h3 className='text-zinc-50 font-bold'>Subject</h3>
              <select className='w-full p-1 rounded' name="subject" onChange={(e) => setSubject(e.currentTarget.value)}>		
                <option value="M">Math</option>
                <option value="R">Reading</option>
                <option value="S">Science</option>
                <option value="C">Composite</option>
                <option value="MCA-III">MCA-III</option>
                <option value="MTAS-III">MTAS-III</option>
                <option value="Trend">Trend</option>
                <option value="allAccount">All Academic Accountability Tests</option>
              </select>
            </div>

            <div>
              <h3 className='text-zinc-50 font-bold'>Grade</h3>
              <select className='w-full p-1 rounded' name="grade" onChange={(e) => setGrade(e.currentTarget.value)}>		
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="HS">HS</option>
                <option value="all">all</option>
              </select>
            </div>

            <div>
              <h3 className='text-zinc-50 font-bold'>Year</h3>
              <select className='w-full p-1 rounded' name="year" onChange={(e) => setYear(e.currentTarget.value)}>		
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2013">2013</option>
                <option value="2012">2012</option>
                <option value="2011">2011</option>
                <option value="2010">2010</option>
                <option value="2009">2009</option>
                <option value="2008">2008</option>
                <option value="2007">2007</option>
                <option value="2006">2006</option>
                <option value="2005">2005</option>
                <option value="2004">2004</option>
                <option value="2003">2003</option>
                <option value="2002">2002</option>
                <option value="2001">2001</option>
                <option value="2000">2000</option>

              </select>
            </div>
          </div>

          <button 
            onClick={searchForReportCard}
            className='bg-emerald-400 text-2xl px-5 py-1.5 rounded hover:bg-emerald-500 duration-100'
          >
            Search
          </button>
          
        </div>

        <div className='w-full p-8'>
          {renderResults()}
        </div>
        
      </main>
    </div>
  )
}

export default Home


