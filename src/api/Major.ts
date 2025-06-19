import Serveraxios from '@/api/instance/index'

export const GetSchool = (year: string , subject: string) => {
    return Serveraxios.get('Major/School?year='+ year +'&subject='+subject)
}

export const GetLogoUrl = (name: string) => {
    return Serveraxios.get('Major/GetLogoUrl?name='+ name )
}

