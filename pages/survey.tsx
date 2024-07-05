import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import { Box, Button, Card, CardContent, Container, FormHelperText, Grid, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import axios from 'axios';
import { nirathawenaKaaryaya } from '../lib/data/consts';
import Image from 'next/image';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { area_structure } from '../lib/data/areaStructure';
import * as Yup from 'yup';
import { getSchoolsByDivision, getSchoolsByProvince, getSchoolsByZone } from '../lib/data/schools';
import { service_structure } from '../lib/data/serviceStructure';
import { q21_22 } from '../lib/data/21_22';
import { q24_25 } from '../lib/data/24_25';
import { q29_30 } from '../lib/data/29_30';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { education_level_structure } from '../lib/data/educationLevelStructure';
import { ISchool } from '../database/schema';
import SelectField from '../components/SelectField';
import HorizontalLine from '../components/HorizontalLine';
import RadioButtonGroup from '../components/RadioButtonGroup';
import CheckBoxGroup from '../components/CheckBoxGroup';
import TextFieldComponent from '../components/TextFieldComponent';
import { GetServerSideProps } from 'next';
import useToast from '../hooks/use-snackbar';

const validationSchema = Yup.object({
  "පළාත": Yup.string().required("පළාත අවශ්‍ය වේ."),
  "කලාපය": Yup.string().required("කලාපය අවශ්‍ය වේ."),
  "කොට්ඨාශය": Yup.string().required("කොට්ඨාශය අවශ්‍ය වේ."),
  "පාසලේ නම සහ පාසල් සංගණන අංකය": Yup.string().required("පාසලේ නම සහ පාසල් සංගණන අංකය අවශ්‍ය වේ."),
  "ජාතික හැඳුනුම්පත් අංකය": Yup.string().required("ජාතික හැඳුනුම්පත් අංකය අවශ්‍ය වේ.").matches(/^(([5,6,7,8,9]{1})([0-9]{1})([0,1,2,3,5,6,7,8]{1})([0-9]{6})([v|V|x|X]))|(([1,2]{1})([0,9]{1})([0-9]{2})([0,1,2,3,5,6,7,8]{1})([0-9]{7}))/g, "ජාතික හැඳුනුම්පත් අංකය වලංගු නොවේ").required("සම්පූර්ණ නම අවශ්‍ය වේ."),
  "අත්සන් ලේඛනයේ අංකය": Yup.number().required("අත්සන් ලේඛනයේ අංකය අවශ්‍ය වේ.").min(1, "අත්සන් ලේඛනයේ අංකය වලංගු නොවේ").max(350, "අත්සන් ලේඛනයේ අංකය වලංගු නොවේ"),
  "වැටුප් ලේඛනයේ අංකය": Yup.number().required("වැටුප් ලේඛනයේ අංකය අවශ්‍ය වේ.").min(1, "වැටුප් ලේඛනයේ අංකය වලංගු නොවේ").max(9999999, "වැටුප් ලේඛනයේ අංකය වලංගු නොවේ"),
  "තරාතිරම (Title)": Yup.string().required("තරාතිරම (Title) අවශ්‍ය වේ."),
  "සම්පූර්ණ නම": Yup.string().required("සම්පූර්ණ නම අවශ්‍ය වේ."),
  "මුලකූරු සමග නම": Yup.string().required("මුලකූරු සමග නම අවශ්‍ය වේ."),
  "මෙම පාසලේ සේවය කරන පදනම වනුයේ": Yup.string().required("මෙම පාසලේ සේවය කරන පදනම අවශ්‍ය වේ."),
  "මෙම පාසලේ දරණ තනතුර": Yup.string().required("මෙම පාසලේ දරණ තනතුර අවශ්‍ය වේ."),
  "උපන් දිනය": Yup.string().required("උපන් දිනය අවශ්‍ය වේ."),
  "ස්ත්‍රී පුරුෂ භාවය": Yup.string().required("ස්ත්‍රී පුරුෂ භාවය අවශ්‍ය වේ."),
  "ජන වර්ගය": Yup.string().required("ජන වර්ගය අවශ්‍ය වේ."),
  "ආගම": Yup.string().required("ආගම අවශ්‍ය වේ."),
  "වර්තමාන විවාහක තත්ත්වය": Yup.string().required("වර්තමාන විවාහක තත්ත්වය අවශ්‍ය වේ."),
  "ඉහළම අධ්‍යාපන සුදුසුකම": Yup.string().required("ඉහළම අධ්‍යාපන සුදුසුකම අවශ්‍ය වේ."),
  "අ.පො.ස. (උ/පෙළ) දී හැදෑරූ විෂය ධාරාව": Yup.string().required("අ.පො.ස. (උ/පෙළ) දී හැදෑරූ විෂය ධාරාව අවශ්‍ය වේ."),
  "මූලික උපාධියක් ලබා ඇත්නම් එය අයත් ක්ෂේත්‍රය": Yup.string().required("මූලික උපාධියක් ලබා ඇත්නම් එය අයත් ක්ෂේත්‍රය අවශ්‍ය වේ."),
  "ඉහළම වෘත්තීය සුදුසුකම අයත් කාණ්ඩය": Yup.string().required("ඉහළම වෘත්තීය සුදුසුකම අයත් කාණ්ඩය අවශ්‍ය වේ."),
  "ඉහළම වෘත්තීය සුදුසුකම": Yup.string().required("ඉහළම වෘත්තීය සුදුසුකම අවශ්‍ය වේ."),
  "පත්වීම් වර්ගීකරණය අනුව අයත්වන සේවාව": Yup.string().required("පත්වීම් වර්ගීකරණය අනුව අයත්වන සේවාව අවශ්‍ය වේ."),
  "වර්තමානයේ අයත්වන පන්තිය/හා ශ්‍රේණිය": Yup.string().required("වර්තමානයේ අයත්වන පන්තිය/හා ශ්‍රේණිය අවශ්‍ය වේ."),
  "වර්තමාන පන්තියට/හා ශ්‍රේණියට පත් වූ/උසස් වූ දිනය": Yup.date().required("වර්තමාන පන්තියට/හා ශ්‍රේණියට පත් වූ/උසස් වූ දිනය අවශ්‍ය වේ."),
  "වර්තමාන සේවයට පත් වූ දිනය": Yup.date().required("වර්තමාන සේවයට පත් වූ දිනය අවශ්‍ය වේ."),
  "වර්තමාන සේවයට පත් වූ භාෂා මාධ්‍යය": Yup.string().required("වර්තමාන සේවයට පත් වූ භාෂා මාධ්‍යය අවශ්‍ය වේ."),
  "පත්වීම් විෂය අයත්වන අංශය": Yup.string().required("පත්වීම් විෂය අයත්වන අංශය අවශ්‍ය වේ."),
  "පත්වීම් විෂය අයත්වන කාණ්ඩය": Yup.string().required("පත්වීම් විෂය අයත්වන කාණ්ඩය අවශ්‍ය වේ."),
  "පත්වීම් විෂය": Yup.string().required("පත්වීම් විෂය අවශ්‍ය වේ."),
  "වැඩිම කාලයක් නිරතවන කාර්යය": Yup.string().required("වැඩිම කාලයක් නිරතවන කාර්යය අවශ්‍ය වේ."),
  "වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය": Yup.string().required("වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය අවශ්‍ය වේ."),
  "වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය": Yup.string().required("වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය අවශ්‍ය වේ."),
  "වැඩිම කාලයක් උගන්වන විෂය": Yup.string().required("වැඩිම කාලයක් උගන්වන විෂය අවශ්‍ය වේ."),
  "වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය": Yup.string().required("වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය අවශ්‍ය වේ."),
  "වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට)": Yup.number().required("වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට) අවශ්‍ය වේ."),
  "දෙවනුව වැඩිම කාලයක් නිරතවන කාර්යය": Yup.string().required("දෙවනුව වැඩිම කාලයක් නිරතවන කාර්යය අවශ්‍ය වේ."),
  "දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය": Yup.string().required("දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය අවශ්‍ය වේ."),
  "දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය": Yup.string().required("දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය අවශ්‍ය වේ."),
  "දෙවනුව වැඩිම කාලයක් වැඩිම කාලයක් උගන්වන විෂය": Yup.string().required("දෙවනුව වැඩිම කාලයක් වැඩිම කාලයක් උගන්වන විෂය අවශ්‍ය වේ."),
  "දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය": Yup.string().required("දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය අවශ්‍ය වේ."),
  "දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට)": Yup.number().required("දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට) අවශ්‍ය වේ."),
  "මෙම පාසලට පත් වුන /අනුයුක්ත වුන දිනය": Yup.date().required("මෙම පාසලට පත් වුන /අනුයුක්ත වුන දිනය අවශ්‍ය වේ."),
  "ඔබ ගුරු පුහුණු සහතිකයක් (ආයතනික/දුරස්ථ) ලබා තිබේද": Yup.string().required("ඔබ ගුරු පුහුණු සහතිකයක් (ආයතනික/දුරස්ථ) ලබා තිබේද යන්න අවශ්‍ය වේ."),
  "ඔබ ජාතික ශික්ෂණ විද්‍යා ඩිප්ලෝමාවක් ලබා තිබේද": Yup.string().required("ඔබ ජාතික ශික්ෂණ විද්‍යා ඩිප්ලෝමාවක් ලබා තිබේද යන්න අවශ්‍ය වේ."),
  "ඔබ අධ්‍යාපනවේදී (B Ed) උපාධියක් ලබා තිබේද": Yup.string().required("ඔබ අධ්‍යාපනවේදී (B Ed) උපාධියක් ලබා තිබේද යන්න අවශ්‍ය වේ."),
  "ඔබ පශ්චාත් උපාධි අධ්‍යාපන ඩිප්ලෝමාවක් (Pg Dip) ලබා තිබේද": Yup.string().required("ඔබ පශ්චාත් උපාධි අධ්‍යාපන ඩිප්ලෝමාවක් (Pg Dip) ලබා තිබේද අවශ්‍ය වේ."),
  "ඔබ අධ්‍යාපනය පිළිබඳ ශාස්ත්‍රපති උපාධිය (Masters) ලබා තිබේද": Yup.string().required("ඔබ අධ්‍යාපනය පිළිබඳ ශාස්ත්‍රපති උපාධිය (Masters) ලබා තිබේද අවශ්‍ය වේ."),
  "පසුගිය පාසල් සංගණනය (2022) සඳහා තොරතුරු ලබා දෙන ලද්දේ": Yup.string().required("පසුගිය පාසල් සංගණනය (2022) සඳහා තොරතුරු ලබා දෙන ලද්දේද යන්න අවශ්‍ය වේ."),
  "ජංගම දුරකථන අංකය": Yup.string().matches(/^\d{10}$/, "ජංගම දුරකථන අංකය වැරදි").required("ජංගම දුරකථන අංකය අවශ්‍ය වේ."),
});

const Page = () => {
  const { showSnackbarError, showSnackbarSuccess } = useToast();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const form = useForm({
    reValidateMode: 'onBlur',
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, watch } = form

  const onSubmit = (data: any) => {
    axios.post(`api/surveyRecords`, { nic: data["ජාතික හැඳුනුම්පත් අංකය"], ...data }).then((response) => {

      if (response.status === 200) {
        showSnackbarSuccess('Your survey record was added successfully!')
      } else {
        throw new Error("Surver Error!")
      }
    }).catch((error) => {
      console.error(error)
      showSnackbarError('Error submitting survey data!',)
    });
  };

  //#region <21-22>
  const ans_21 = watch('පත්වීම් විෂය අයත්වන අංශය');
  const ans_22_a = watch('පත්වීම් විෂය අයත්වන කාණ්ඩය');

  const list_21 = useMemo(() => {
    return q21_22.map(a => a.category)
  }, [])

  const list_22_a = useMemo(() => {
    if (!ans_21)
      return []

    return q21_22.find(a => a.category == ans_21)?.appoint?.map(z => z.name) || []
  }, [ans_21])

  const list_22_b = useMemo(() => {
    if (!ans_22_a)
      return [];

    return q21_22
      .find(a => a.category == ans_21)
      ?.appoint.find(z => z.name == ans_22_a)
      ?.subjects?.map(d => d.name) || []

  }, [ans_22_a])
  //#endregion

  //#region <Provinces>
  const selectedProvince = watch('පළාත');
  const selectedZone = watch('කලාපය');
  const selectedDivision = watch('කොට්ඨාශය');

  const provinces = useMemo(() => {
    return area_structure.map(a => a.name)
  }, [])

  const zones = useMemo(() => {
    if (!selectedProvince)
      return []

    return area_structure.find(a => a.name == selectedProvince)?.zones?.map(z => z.name) || []
  }, [selectedProvince])
  const divisions = useMemo(() => {
    if (!selectedZone)
      return [];

    return area_structure
      .find(a => a.name == selectedProvince)
      ?.zones.find(z => z.name == selectedZone)
      ?.divisions?.map(d => d.name) || []

  }, [selectedProvince, selectedZone])
  //#endregion

  //#region <24-25>
  const ans_24 = watch('වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය');
  const ans_25_a = watch('වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය');

  const list_24 = useMemo(() => {
    return q24_25.map(a => a.category)
  }, [])

  const list_25_a = useMemo(() => {
    if (!ans_24)
      return []

    return q24_25.find(a => a.category == ans_24)?.appoint?.map(z => z.name) || []
  }, [ans_24])

  const list_25_b = useMemo(() => {
    if (!ans_25_a)
      return [];

    return q24_25
      .find(a => a.category == ans_24)
      ?.appoint.find(z => z.name == ans_25_a)
      ?.subjects?.map(d => d.name) || []

  }, [ans_25_a])
  //#endregion

  //#region <29-31>
  const ans_29 = watch('දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය');
  const ans_30_a = watch('දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය');

  const list_29 = useMemo(() => {
    return q29_30.map(a => a.category)
  }, [])

  const list_30_a = useMemo(() => {
    if (!ans_29)
      return []

    return q29_30.find(a => a.category == ans_29)?.appoint?.map(z => z.name) || []
  }, [ans_29])

  const list_30_b = useMemo(() => {
    if (!ans_30_a)
      return [];

    return q29_30
      .find(a => a.category == ans_29)
      ?.appoint.find(z => z.name == ans_30_a)
      ?.subjects?.map(d => d.name) || []

  }, [ans_30_a])
  //#endregion

  const selectedHighestEducationCategory = watch('ඉහළම වෘත්තීය සුදුසුකම අයත් කාණ්ඩය');
  const highestEducationCategories = useMemo(() => {
    return education_level_structure.map(a => a.name)
  }, [])

  const highestEducations = useMemo(() => {
    if (!selectedHighestEducationCategory) {
      return []
    }

    return education_level_structure.find(a => a.name == selectedHighestEducationCategory)?.categories?.map(c => c.name) || []
  }, [selectedHighestEducationCategory])

  const [schools, setSchools] = React.useState<ISchool[]>([]);

  const selectedService = watch('පත්වීම් වර්ගීකරණය අනුව අයත්වන සේවාව');
  const services = useMemo(() => {
    return service_structure.map(a => a.name)
  }, [])

  const serviceClasses = useMemo(() => {
    if (!selectedService) {
      return []
    }

    return service_structure.find(a => a.name == selectedService)?.classes?.map(c => c.name) || []
  }, [selectedService])



  React.useEffect(() => {
    if (!!selectedDivision) {
      getSchoolsByDivision(selectedDivision)
        .then(schools => setSchools(schools))
      return;
    }

    if (!!selectedZone) {
      getSchoolsByZone(selectedZone)
        .then(schools => setSchools(schools))
      return;
    }

    if (!!selectedProvince) {
      getSchoolsByProvince(selectedProvince)
        .then(schools => setSchools(schools))
      return;
    }

    setSchools([]);
  }, [selectedProvince, selectedZone, selectedDivision])

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = ['පුද්ගල තොරතුරු', 'අධ්‍යාපන සුදුසුකම', 'පත්වීම් වර්ගීකරණය', 'උගන්වන විෂයයන් පිළිබඳ තොරතුරු', 'අමතර තොරතුරු', 'තොරතුරු යවන්න'];

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={3}
            sx={{ mb: 3 }}
          >

            <p style={{ fontSize: "20px", fontWeight: 'bold' }}>
              පුද්ගල තොරතුරු
            </p>
            <TextFieldComponent label="01-A ජාතික හැඳුනුම්පත් අංකය" name="ජාතික හැඳුනුම්පත් අංකය" />


            <TextFieldComponent label="01-B  අත්සන් ලේඛනයේ අංකය"
              name="අත්සන් ලේඛනයේ අංකය" />
            <TextFieldComponent label="01-C වැටුප් ලේඛනයේ අංකය"
              name="වැටුප් ලේඛනයේ අංකය" />
            <RadioButtonGroup
              name="තරාතිරම (Title)"
              label="02. තරාතිරම (Title) "
              options={[
                'Ven',
                'Rev. Fr/Sr',
                'Mr.',
                'Mrs.',
                'Ms.'
              ]}
            />
            <TextFieldComponent label="03-B. සම්පූර්ණ නම ඉංග්‍රීසියෙන්"
              name="සම්පූර්ණ නම" />
            <TextFieldComponent label="03-A. මුලකූරු සමග නම ඉංග්‍රීසියෙන්"
              name="මුලකූරු සමග නම" />

            <p style={{ fontSize: "20px", fontWeight: 'bold' }}>
              {t('ඔබ දැනට සේවය කරන පාසල පිළිබඳ විස්තර')}
              <br />
              <span style={{ fontSize: "15px", fontWeight: '' }}>
                {t('(තාවකාලිකව අනුයුක්තව සිටින්නන් මෙහිදී වැටුප් ලේඛනයේ නම ඇතුළත් වන පාසල පිළිබඳව සඳහන් කළ යුතු වේ)')}
              </span>
            </p>
            <Grid container
            >
              <Grid item
                xs={4}>
                <SelectField name={"පළාත"}
                  label={"පළාත"}
                  options={provinces} />
              </Grid>

              <Grid item
                xs={4}>
                <SelectField name={"කලාපය"}
                  label={"කලාපය"}
                  options={zones} />
                {!selectedProvince && <FormHelperText>පළමුව පළාත තෝරන්න</FormHelperText>}
              </Grid>


              <Grid item
                xs={4}>
                <SelectField name={"කොට්ඨාශය"}
                  label={"කොට්ඨාශය"}
                  options={divisions} />
                {!selectedZone && <FormHelperText>පළමුව කලාපය තෝරන්න</FormHelperText>}
              </Grid>
            </Grid>
            <div style={{ marginTop: '20px' }}></div>
            <SelectField
              name={"පාසලේ නම සහ පාසල් සංගණන අංකය"}
              label="වැටුප් ලේඛනයේ නම ඇතුළත් වන පාසලේ නම සහ පාසල් සංගණන අංකය"
              options={schools?.map(s => s.name)}
            />

            <RadioButtonGroup
              name="මෙම පාසලේ දරණ තනතුර"
              label="04. මෙම පාසලේ දරණ තනතුර"
              options={[
                'විදුහල්පති',
                'වැ.බ. විදුහල්පති/විදුහල්පති වැඩ ආවර්ණය',
                'නියෝජ්‍ය විදුහල්පති/වැ.බ.නි.විදුහල්පති',
                'සහකාර විදුහල්පති/වැ.බ.ස. විදුහල්පති',
                'අංශ ප්‍රධානි/වැ.බ.අංශ ප්‍රධානි',
                'ශ්‍රේණි ප්‍රධානි',
                'ගුරු උපදේශක',
                'ගුරුවරයා',
                'ගුරු සහායක/ස්වේච්ඡා ගුරු'
              ]}
            />


            <RadioButtonGroup
              label="05. මෙම පාසලේ සේවය කරන පදනම වනුයේ"
              options={[
                'මෙම පාසලේ වැටුප් ලේඛනයට ඇතූළත් හා මෙම පාසලේම පූර්ණකාලීනව/අර්ධ කාලීනව සේවය කරන',
                'මෙම පාසලේ වැටුප් ලේඛනයට ඇතුළත් නමුත් වෙනත් පාසලකට තාවකාලිකව අනුයුක්තව සිටින',
                'මෙම පාසලේ වැටුප් ලේඛනයට ඇතුළත් නමුත් වෙනත් කාර්යාලයකට/ ආයතනයකට තාවකාලිකව අනුයුක්තව සිටින',
                'මෙම පාසලේ වැටුප් ලේඛනයට ඇතුළත් දැනට වැටුප් සහිත නිවාඩු ගොස් ඇති (විශ්‍රාම පූර්ව නිවාඩු ලබා ඇති/ප්‍රසූත නිවාඩු ගොස් ඇති/අධ්‍යයන නිවාඩු ලබා ඇති) ආදී',
                'මෙම පාසලේ වැටුප් ලේඛනයට ඇතුළත් දැනට වැටුප් රහිත නිවාඩු ගොස් ඇති/තාවකාලිකව වැඩ තහනම් වී ඇති'
              ]}
              name={'මෙම පාසලේ සේවය කරන පදනම වනුයේ'}
            />

            <TextFieldComponent label="06. උපන් දිනය-(YYYY-MM-DD [උදාහරන 1985-11-02])"
              name="උපන් දිනය" />
            <RadioButtonGroup
              label="07. ස්ත්‍රී පුරුෂ භාවය"
              options={[
                'පුරුෂ',
                'ස්ත්‍රී'
              ]}
              name={'ස්ත්‍රී පුරුෂ භාවය'}
            />

            <RadioButtonGroup
              label="08. ජන වර්ගය"
              options={[
                'සිංහල',
                'දෙමළ',
                'මුස්ලිම්',
                'වෙනත්'
              ]}
              name={'ජන වර්ගය'}
            />

            <RadioButtonGroup
              label="09. ආගම"
              options={[
                'බෞද්ධ',
                'හින්දු',
                'ඉස්ලාම්',
                'කතෝලික',
                'ක්‍රිස්තියානි',
                'වෙනත්'
              ]}
              name={'ආගම'}
            />
            <RadioButtonGroup
              label="10. වර්තමාන විවාහක තත්ත්වය"
              options={[
                'විවාහක',
                'අවිවාහක',
                'වැන්දඹු',
                'වෙනත්'
              ]}
              name={'වර්තමාන විවාහක තත්ත්වය'}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={3}
            sx={{ mb: 3 }}
          >

            <p style={{ fontSize: "20px", fontWeight: 'bold' }}>
              අධ්‍යාපන සුදුසුකම
            </p>

            <RadioButtonGroup
              label="11. ඉහළම අධ්‍යාපන සුදුසුකම"
              options={[
                'අ.පො.ස.(සා / පෙළ)ට අඩු',
                'අ.පො.ස.(සා / පෙළ) හෝ ඊට සමාන්තර (O/L)',
                'අ.පො.ස.(උ / පෙළ) හෝ ඊට සමාන්තර (A/L)',
                'උපාධි හෝ ඊට සමාන්තර (BA/BSc/BEd…)',
                'පශ්චාත් උපාධි ඩිප්ලෝමා හෝ ඊට සමාන්තර (PG Dip)',
                'පශ්චාත් උපාධි හෝ ඊට සමාන්තර (MA/MSc/MEd…)',
                'දර්ශනපති උපාධි හෝ ඊට සමාන්තර (MPhil)',
                'දර්ශනශූරී උපාධි හෝ ඊට සමාන්තර (PhD)'
              ]}
              name={'ඉහළම අධ්‍යාපන සුදුසුකම'}
            />

            <RadioButtonGroup
              label="12. අ.පො.ස. (උ/පෙළ) දී හැදෑරූ විෂය ධාරාව"
              options={[
                'ජීව විද්‍යා',
                'භෞතික විද්‍යා (ගණිත)',
                'කලා',
                'වාණිජ',
                'ජෛව පද්ධති තාක්ෂණවේදය',
                'ඉංජිනේරු තාක්ෂණවේදය',
                'පොදු විෂය ධාරාව'
              ]}
              name={'අ.පො.ස. (උ/පෙළ) දී හැදෑරූ විෂය ධාරාව'}
            />
            <RadioButtonGroup
              label="13. මූලික උපාධියක් ලබා ඇත්නම් එය අයත් ක්ෂේත්‍රය"
              options={[
                'අධ්‍යාපන',
                'ජීව විද්‍යා',
                'භෞතික විද්‍යා',
                'කලා',
                'කළමනාකරණ/ වාණිජ්‍ය',
                'කෘෂිකර්ම',
                'පරිගණක ආශ්‍රිත',
                'වෙනත්'

              ]}
              name={'මූලික උපාධියක් ලබා ඇත්නම් එය අයත් ක්ෂේත්‍රය'}
            />



            <p style={{ fontSize: "20px", fontWeight: 'bold' }}>ඉහළම වෘත්තීය සුදුසුකම</p>

            <Grid container spacing={0}>
              <Grid item
                xs={6}
                sx={{ paddingRight: '10px' }}  >
                <SelectField name={"ඉහළම වෘත්තීය සුදුසුකම අයත් කාණ්ඩය"}
                  label={"14. ඉහළම වෘත්තීය සුදුසුකම අයත් කාණ්ඩය"}
                  options={highestEducationCategories} />
              </Grid>

              <Grid item
                xs={6}>
                <SelectField name={"ඉහළම වෘත්තීය සුදුසුකම"}
                  label={"15. ඉහළම වෘත්තීය සුදුසුකම"}
                  options={highestEducations}
                  disabled={!highestEducations.length} />
                {(!selectedHighestEducationCategory && !!highestEducations.length) && <FormHelperText>පළමුව ඉහළම වෘත්තීය සුදුසුකම අයත් කාණ්ඩය තෝරන්න</FormHelperText>}
              </Grid>
            </Grid>
          </Stack>
        );

      case 2:
        return (
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={3}
            sx={{ mb: 3 }}
          >

            <p style={{ fontSize: "20px", fontWeight: 'bold' }}>පත්වීම් වර්ගීකරණය</p>
            <Grid container spacing={0}>
              <Grid item
                xs={6}
                sx={{ paddingRight: '10px' }}  >

                <SelectField name={"පත්වීම් වර්ගීකරණය අනුව අයත්වන සේවාව"}
                  label={"16. පත්වීම් වර්ගීකරණය අනුව අයත්වන සේවාව"}
                  options={services} />
              </Grid>

              <Grid item
                xs={6}>
                <SelectField name={"වර්තමානයේ අයත්වන පන්තිය/හා ශ්‍රේණිය"}
                  label={"17. වර්තමානයේ අයත්වන පන්තිය/හා ශ්‍රේණිය"}
                  options={serviceClasses}
                  disabled={!serviceClasses.length} />
                {(!selectedService && !!serviceClasses.length) && <FormHelperText>පළමුව පත්වීම් වර්ගීකරණය අනුව අයත්වන සේවාව තෝරන්න</FormHelperText>}
              </Grid>
            </Grid>


            <TextFieldComponent label="18. වර්තමාන පන්තියට/හා ශ්‍රේණියට පත් වූ/උසස් වූ දිනය-(YYYY-MM-DD [උදාහරන 1989-05-09])"
              name="වර්තමාන පන්තියට/හා ශ්‍රේණියට පත් වූ/උසස් වූ දිනය" />
            <TextFieldComponent label="19. වර්තමාන සේවයට පත් වූ දිනය-(YYYY-MM-DD [උදාහරන 2000-01-31])"
              name="වර්තමාන සේවයට පත් වූ දිනය" />
            <RadioButtonGroup
              label="20. වර්තමාන සේවයට පත් වූ භාෂා මාධ්‍යය"
              options={[
                'සිංහල මාධ්‍යය',
                'දෙමළ මාධ්‍යය',
                'ඉංග්‍රීසි මාධ්‍යය'
              ]}
              name={'වර්තමාන සේවයට පත් වූ භාෂා මාධ්‍යය'}
            />
            <HorizontalLine />
            <p style={{ fontSize: "20px", fontWeight: 'bold' }}>පත්වීම් විෂය</p>

            <RadioButtonGroup
              label="21. පත්වීම් විෂය අයත්වන අංශය"
              options={list_21}
              name={'පත්වීම් විෂය අයත්වන අංශය'}
            />

            <Grid container spacing={0}>
              <Grid item
                xs={6}
                sx={{ paddingRight: '10px' }}  >

                <SelectField
                  name={"පත්වීම් විෂය අයත්වන කාණ්ඩය"}
                  label="22.A. පත්වීම් විෂය අයත්වන කාණ්ඩය"
                  options={list_22_a} />
                {(!ans_21 && !!list_21.length) && <FormHelperText>පළමුව පත්වීම් විෂය තෝරන්න</FormHelperText>}
              </Grid>

              <Grid item
                xs={6}>
                <SelectField
                  name={"පත්වීම් විෂය"}
                  label="22.B. පත්වීම් විෂය"
                  options={list_22_b}
                  disabled={!list_22_b.length} />
                {(!ans_22_a && !!list_22_a.length) && <FormHelperText>පළමුව පත්වීම් විෂය අයත්වන කාණ්ඩය තෝරන්න</FormHelperText>}
              </Grid>
            </Grid>
          </Stack>
        );

      case 3:
        return (
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={3}
            sx={{ mb: 3 }}
          >
            <p style={{ fontSize: "22px", fontWeight: 'bold' }}>
              වැඩිම කාලයක් හා දෙවනුව වැඩිම කාලයක් උගන්වන විෂයයන් පිළිබඳ තොරතුරු
            </p>

            <SelectField
              label="23.වැඩිම කාලයක්  නිරතවන කාර්යය"
              options={nirathawenaKaaryaya}
              name={'වැඩිම කාලයක්  නිරතවන කාර්යය'}
            />

            <RadioButtonGroup
              label="24. වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය :"
              options={list_24}
              name={'වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය'}
            />

            {(!!ans_24 || !list_24.length) &&
              <Grid container spacing={0}>
                <Grid item
                  xs={6}
                  sx={{ paddingRight: '10px' }}  >

                  <SelectField
                    name={"වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය"}
                    label="25-A. වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය"
                    options={list_25_a} />
                  {(!ans_24 && !!list_24.length) && <FormHelperText>පළමුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය තෝරන්න</FormHelperText>}
                </Grid>

                <Grid item
                  xs={6}>
                  <SelectField
                    name={"වැඩිම කාලයක් උගන්වන විෂය"}
                    label="25-B. වැඩිම කාලයක් උගන්වන විෂය"
                    options={list_25_b}
                    disabled={!list_25_b.length} />
                  {(!ans_25_a && !!list_25_a.length) && <FormHelperText>පළමුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය තෝරන්න</FormHelperText>}
                </Grid>
              </Grid>
            }
            <RadioButtonGroup
              label="26. වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය :"
              options={[
                'සිංහල මාධ්‍යය',
                'දෙමළ මාධ්‍යය',
                'ඉංග්‍රීසි මාධ්‍යය'
              ]}
              name={'වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය'}
            />
            <TextFieldComponent label="27. වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට) :"
              name="වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට)" />

            <HorizontalLine />
            <p style={{ fontSize: "22px", fontWeight: 'bold' }}>
              දෙවනුව වැඩිම (Secondary) කාලයක් නිරත වන කාර්යය/උගන්වන විෂය පිළිබඳ තොරතුරු
            </p>

            <SelectField
              label="28. දෙවනුව වැඩිම කාලයක්  නිරතවන කාර්යය"
              options={['නිරත වන්නේ ප්‍රධාන කාර්යයක පමණි', ...nirathawenaKaaryaya]}
              name={'දෙවනුව වැඩිම කාලයක් නිරතවන කාර්යය'}
            />

            <RadioButtonGroup
              label="29. දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය"
              options={list_29}
              name={'දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය'}
            />

            {ans_29 != 'නිරත වන්නේ ප්‍රධාන කාර් යක පමණි' && <Grid container spacing={0}>
              <Grid item
                xs={6}
                sx={{ paddingRight: '10px' }}  >

                <SelectField
                  name={"දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය"}
                  label="30-A. වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය"
                  options={list_30_a} />
                {(!ans_29 && !!list_29.length) && <FormHelperText>පළමුව දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය තෝරන්න</FormHelperText>}
              </Grid>

              <Grid item
                xs={6}>
                <SelectField
                  name={"දෙවනුව වැඩිම කාලයක් වැඩිම කාලයක් උගන්වන විෂය"}
                  label="30-B. දෙවනුව වැඩිම කාලයක් වැඩිම කාලයක් උගන්වන විෂය"
                  options={list_30_b}
                  disabled={!list_30_b.length} />
                {(!ans_30_a && !!list_30_a.length) && <FormHelperText>පළමුව දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන කාණ්ඩය තෝරන්න</FormHelperText>}
              </Grid>
            </Grid>
            }

            {/* 
<RadioButtonGroup
label="28/29. දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය :"
options={[
'ප්‍රාථමික අංශය',
'ද්විතීයික අංශය(6-11)',
'උසස් පෙළ අංශය'
]}
name={'දෙවනුව වැඩිම කාලයක් උගන්වන විෂය අයත් වන අංශය'}
/> */}
            <RadioButtonGroup
              label="31. දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය :"
              options={[
                'සිංහල මාධ්‍යය',
                'දෙමළ මාධ්‍යය',
                'ඉංග්‍රීසි මාධ්‍යය'
              ]}
              name={'දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ මාධ්‍යය'}
            />
            <TextFieldComponent label="32. දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට) :"
              name="දෙවනුව වැඩිම කාලයක් උගන්වන විෂය ඉගැන්වීමේ යෙදී සිටින කාලච්ඡේද ගණන (සතියකට)" />

          </Stack>
        );

      case 4:
        return (
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={3}
            sx={{ mb: 3 }}
          >
            <p style={{ fontSize: "22px", fontWeight: 'bold' }}>
              අමතර තොරතුරු
            </p>

            <TextFieldComponent label="33. මෙම පාසලට පත් වුන /අනුයුක්ත වුන දිනය"
              name="මෙම පාසලට පත් වුන /අනුයුක්ත වුන දිනය" />

            {/* 
                      <RadioButtonGroup
                        label="27. අංශය"
                        options={[
                          'ප්‍රාථමික (1-5 ශ්‍රේණි) අංශය - 1',
                          'ද්විතීයික (6-11 ශ්‍රේණි) අංශය - 2',
                          'උසස් පෙළ (12-13 ශ්‍රේණි) අංශය - 3'
                        ]}
                        name={'අංශය'}
                      /> 
                      <CheckBoxGroup
                        label="28. අංශය"
                        options={anshaya}
                        name={'අංශය'}
                      />
                       */}

            <RadioButtonGroup
              label="34. ඔබ ගුරු පුහුණු සහතිකයක් (ආයතනික/දුරස්ථ) ලබා තිබේද?"
              options={['ඔව්', 'නැත']}
              name={'ඔබ ගුරු පුහුණු සහතිකයක් (ආයතනික/දුරස්ථ) ලබා තිබේද'}
            />


            <RadioButtonGroup
              label="35. ඔබ ජාතික ශික්ෂණ විද්‍යා ඩිප්ලෝමාවක් ලබා තිබේද?"
              options={['ඔව්', 'නැත']}
              name={'ඔබ ජාතික ශික්ෂණ විද්‍යා ඩිප්ලෝමාවක් ලබා තිබේද'}
            />

            <RadioButtonGroup
              label="36. ඔබ අධ්‍යාපනවේදී (B Ed) උපාධියක් ලබා තිබේද?"
              options={['ඔව්', 'නැත']}
              name={'ඔබ අධ්‍යාපනවේදී (B Ed) උපාධියක් ලබා තිබේද'}
            />

            <RadioButtonGroup
              label="37. ඔබ පශ්චාත් උපාධි අධ්‍යාපන ඩිප්ලෝමාවක් (Pg Dip) ලබා තිබේද?"
              options={['ඔව්', 'නැත']}
              name={'ඔබ පශ්චාත් උපාධි අධ්‍යාපන ඩිප්ලෝමාවක් (Pg Dip) ලබා තිබේද'}
            />

            <RadioButtonGroup
              label="38. ඔබ අධ්‍යාපනය පිළිබඳ ශාස්ත්‍රපති උපාධිය (Masters) ලබා තිබේද?"
              options={['ඔව්', 'නැත']}
              name={'ඔබ අධ්‍යාපනය පිළිබඳ ශාස්ත්‍රපති උපාධිය (Masters) ලබා තිබේද'}
            />

            <RadioButtonGroup
              label="39. පසුගිය පාසල් සංගණනය (2022) සඳහා තොරතුරු ලබා දෙන ලද්දේ"
              options={[
                'මෙම පාසලෙනි',
                'වෙනත් පාසලකිනි',
                'තොරතුරු ලබා දුන්නේ නැත'
              ]}
              name={'පසුගිය පාසල් සංගණනය (2022) සඳහා තොරතුරු ලබා දෙන ලද්දේ'}
            />

            <TextFieldComponent label="40. ජංගම දුරකථන අංකය-(ඉලක්කම් 10ක අංකය [උදාහරන 0701234567])" name="ජංගම දුරකථන අංකය" />
            <TextFieldComponent label="41. ජාතික හැඳුනුම්පත් අංකය" name="ජාතික හැඳුනුම්පත් අංකය" />

          </Stack>
        );
      case 5:
        return (
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={3}
            sx={{ mb: 3 }}
          >
            <p style={{ fontSize: "22px", fontWeight: 'bold' }}>
              තොරතුරු යවන්න
            </p>

            ඔබ විසින් ඇතුලත් කරන තොරතුරු දෙපාර්තුමේන්තුවට ඉතාමත් වැදගත් බැවින් කරුණාකර තොරතුරු එවීමට පෙර එක් වරක් නැවත පරීක්ශා කරන්න.
            <br /><br />

            <CheckBoxGroup
              label=""
              options={[
                'මෙහි දී සපයනු ලබන සියළු ම තොරතුරු සත්‍ය හා නිවැරදි බවට සහතික කරමි'
              ]}
              name={''}
            />

            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={() => handleSubmit(onSubmit)}
            >
              තොරතුරු යවන්න | Submit Information
            </Button>
          </Stack>
        );
      default:
        return 'Unknown step';
    }
  }


  return (
    <>
      <Head>
        <title>
          පාසල් සංගණනය - 2024
        </title>
      </Head>

      < Grid
        container
        sx={{
          display: 'flex',
          flex: '1 1 auto', flexDirection: 'column',
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
        }}
      >
        <Grid
          item={true}
          xl={9}
          xs={12}
          lg={9}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 4
            }}
          >


            <Container maxWidth="xl">
              <Stack spacing={2}>

                <Card sx={{ overflow: 'visible' }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={4}
                    >
                      <Typography variant="h4">
                        {t('පාසල් සංගණනය')} - 2024
                      </Typography>

                      <Image width={40}
                        height={55}
                        alt={'srilanka emblem'}
                        src={"/static/images/srilanka-emblem.png"} />
                    </Stack>
                    <p style={{ fontSize: "22px", fontWeight: 'bold' }}>
                      {t('ගුරු විදුහල්පති තොරතුරු ආකෘති පත්‍රය')} &nbsp;
                      <span style={{ fontSize: "18px", fontWeight: '' }}>
                        {t('(සංගණන දිනය - 2024 ජුනි 01)')}
                      </span>
                    </p>
                    <FormProvider {...form}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ margin: 'auto', marginTop: '50px' }}>
                          <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => (
                              <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                          <Box sx={{ mt: 2, mb: 2 }}>
                            {activeStep === steps.length ? (
                              <Box>
                                <Typography>All steps completed - you&apos;re finished</Typography>
                                <Button onClick={handleReset}>Reset</Button>
                              </Box>
                            ) : (
                              <Box>
                                {getStepContent(activeStep)}
                                <Box sx={{ mt: 2 }}>
                                  <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                  >
                                    Back
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                  >
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                  </Button>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>


                      </form>
                    </FormProvider>
                  </CardContent>
                </Card>
              </Stack>
            </Container>

          </Box>
        </Grid>
      </Grid>
    </>
  );
};



interface ServerSideProps {
  locale?: string;
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: ServerSideProps) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en')),
  },
});

export default Page;
