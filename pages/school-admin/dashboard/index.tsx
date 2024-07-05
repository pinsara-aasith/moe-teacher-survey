import { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Box,
    Grid,
    Typography,
    CardContent,
    Card,
    Stack,
    Divider,
    Alert,
    LinearProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { FiTrash } from 'react-icons/fi';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { GetServerSidePropsContext } from 'next';
import withAuth from '../../../util/withAuth';
import { ISchool, IUser } from '../../../database/schema';
import useToast from '../../../hooks/use-snackbar';

type Teacher = {
    _id: number;
    nic: string;
    name: string;
    gender: string;
};

type FormValues = {
    nic: string;
    name: string;
    gender: string;
};

const validationSchema = Yup.object().shape({
    nic: Yup.string().required('NIC is required'),
    name: Yup.string().required('Name is required'),
    gender: Yup.string().required('Gender is required'),
});


export const getServerSideProps = (context: GetServerSidePropsContext) => withAuth(context, async (user) => {
    return {
        props: {
            authUser: user
        },
    };
});


export default function Home(props: { authUser: IUser }) {
    const school = props.authUser.school as ISchool
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const toast = useToast();

    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const retrieveTeachers = async () => {
        setLoading(true)
        await fetch(`/api/schools/${school.code}/teachers`)
            .then(res => res.json())
            .then(res => setTeachers(res.data)).finally(() => {
                setLoading(false)
            });

    }

    useEffect(() => {
        retrieveTeachers()
    }, []);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {

        await fetch(`/api/schools/${school.code}/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        reset();
        await retrieveTeachers();

        toast.showSnackbar(`Teacher with name ${data.name} was successfully added`, {}, 'success');
    };


    // const handleEdit = (teacher: Teacher) => {
    //     setValue('nic', teacher.nic);
    //     setValue('name', teacher.name);
    //     setValue('gender', teacher.gender);
    //     setEditMode(true);
    //     setCurrentId(teacher.id);
    // };

    const handleDelete = async (id: number) => {
        if (confirm('Do you really want to delete this teacher?')) {
            await fetch(`/api/schools/${school.code}/teachers/${id}`, {
                method: 'DELETE',
            });
            retrieveTeachers()
        }

    };

    return (
        <Grid
            container={true}
            item={true}
            sx={{
                height: '100vh',
                background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
                justifyContent: 'center',
                py: '7vh',
            }}
        >
            <Grid
                item={true}
                xl={9}
                xs={12}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}
            >

                <Container maxWidth="xl">
                    <Card sx={{ overflow: 'visible', textAlign: 'center' }}>
                        <CardContent>
                            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                                <Typography variant="h5">
                                    පාසල් සංගණනය - 2024 | பள்ளிக் கணக்கெடுப்பு - 2024
                                </Typography>
                                <Typography variant="body2">
                                    අධ්‍යාපන අමාත්‍යාංශය | கல்வி அமைச்சு
                                </Typography>
                                <Typography variant="body2">
                                    ගුරුවරුන්ගේ තොරතුරු ඇතුලත් කිරීමේ ආකෘති පත්‍රය (2024) | ஆசிரியர் தகவல் நுழைவு படிவம் (2024)
                                </Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>{school.name}</Typography>
                            </Stack>
                            <Divider variant="middle" sx={{ m: 2 }} />

                            <Grid

                                container
                                spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Box
                                        component="form"
                                        onSubmit={handleSubmit(onSubmit)}
                                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                                    >
                                        <TextField
                                            label="NIC"
                                            variant="outlined"
                                            {...register('nic')}
                                            error={!!errors.nic}
                                            helperText={errors.nic ? errors.nic.message : ''}
                                        />
                                        <TextField
                                            label="Name"
                                            variant="outlined"
                                            {...register('name')}
                                            error={!!errors.name}
                                            helperText={errors.name ? errors.name.message : ''}
                                        />

                                        <FormControl fullWidth variant="outlined" margin="normal">
                                            <InputLabel id="gender-label">Gender</InputLabel>
                                            <Controller
                                                name="gender"
                                                control={control}
                                                defaultValue=""
                                                render={({ field }) => (
                                                    <Select
                                                        labelId="gender-label"
                                                        id="gender"
                                                        label="Gender"
                                                        {...field}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        <MenuItem value="Male">Male</MenuItem>
                                                        <MenuItem value="Female">Female</MenuItem>
                                                        <MenuItem value="Other">Other</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>

                                        <Button type="submit" variant="contained" color="primary">
                                            {editMode ? 'Update' : 'Add'} Teacher
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Alert sx={{ mb: 2 }}>ඔබගේ පාසලේ සේවයේ නිරත ගුරුවරු <b>පමණක්</b> ඇතුලත් කරන්න
                                        <br /> உங்கள் பள்ளியில் உள்ள ஆசிரியர்களை மட்டும் உள்ளிடவும்
                                    </Alert>
                                    {loading && <LinearProgress />}
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>NIC</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Gender</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {teachers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center">
                                                        <Typography variant="body2">No teachers available !</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (teachers.map((teacher) => (
                                                <TableRow key={teacher._id}>
                                                    <TableCell>{teacher.nic}</TableCell>
                                                    <TableCell>{teacher.name}</TableCell>
                                                     <TableCell>{teacher.gender}</TableCell>
                                                    <TableCell>
                                                        {/* <IconButton onClick={() => handleEdit(teacher)}>
                                                            <FiEdit />
                                                        </IconButton> */}
                                                        <IconButton onClick={() => handleDelete(teacher._id)}>
                                                            <FiTrash />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Typography sx={{ marginTop: '10px' }} variant="body2" color="text.secondary" align="center">
                        {'Copyright © 2024 Statistic Branch, Ministry of Education. All Rights Reserved.'}
                    </Typography>
                </Container>
            </Grid>
        </Grid>
    );
}
