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
} from '@mui/material';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

type Teacher = {
    id: number;
    nic: string;
    name: string;
    subject: string;
};

type FormValues = {
    nic: string;
    name: string;
    subject: string;
};

const validationSchema = Yup.object().shape({
    nic: Yup.string().required('NIC is required'),
    name: Yup.string().required('Name is required'),
    subject: Yup.string().required('Subject is required'),
});

export default function Home() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    useEffect(() => {
        fetch('/api/teachers')
            .then(res => res.json())
            .then(data => setTeachers(data));
    }, []);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (editMode) {
            await fetch(`/api/teachers/${currentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            setEditMode(false);
            setCurrentId(null);
        } else {
            await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        }
        reset();
        fetch('/api/teachers')
            .then(res => res.json())
            .then(data => setTeachers(data));
    };

    const handleEdit = (teacher: Teacher) => {
        setValue('nic', teacher.nic);
        setValue('name', teacher.name);
        setValue('subject', teacher.subject);
        setEditMode(true);
        setCurrentId(teacher.id);
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/teachers/${id}`, {
            method: 'DELETE',
        });
        fetch('/api/teachers')
            .then(res => res.json())
            .then(data => setTeachers(data));
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
                                        <TextField
                                            label="Subject"
                                            variant="outlined"
                                            {...register('subject')}
                                            error={!!errors.subject}
                                            helperText={errors.subject ? errors.subject.message : ''}
                                        />
                                        <Button type="submit" variant="contained" color="primary">
                                            {editMode ? 'Update' : 'Add'} Teacher
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Alert sx={{mb:2}}>ඔබගේ පාසලේ සේවයේ නිරත ගුරුවරු <b>පමණක්</b> ඇතුලත් කරන්න
                                    <br/> உங்கள் பள்ளியில் உள்ள ஆசிரியர்களை மட்டும் உள்ளிடவும்</Alert>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>NIC</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Subject</TableCell>
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
                                                <TableRow key={teacher.id}>
                                                    <TableCell>{teacher.nic}</TableCell>
                                                    <TableCell>{teacher.name}</TableCell>
                                                    <TableCell>{teacher.subject}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleEdit(teacher)}>
                                                            <FiEdit />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDelete(teacher.id)}>
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
