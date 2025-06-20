import Serveraxios from '@/api/instance/index'

export const GetSchool = (year: string , subject: string,is985:string,pici :string,province:string,prefecture:string,county:string) => {
    return Serveraxios.get(`Major/School?year=${year}&subject=${subject}&is985=${is985}&pici=${pici}&province=${province}&prefecture=${prefecture}&county=${county}`)
}

export const GetPlan = (year: string , subject: string) => {
    return Serveraxios.get(`Major/GetPlan?year=${year}&subject=${subject}`)
}

export const GetSubject = (year: string , subject: string) => {
    return Serveraxios.get(`Major/GetSubject?year=${year}&subject=${subject}`)
}

export const GetLogoUrl = (name: string) => {
    return Serveraxios.get('Major/GetLogoUrl?name='+ name )
}

export const GetPici = () => {
    return Serveraxios.get('Major/GetPici')
}

export const GetCitySchool = () => {
    return Serveraxios.get('Major/GetCitySchool')
}

