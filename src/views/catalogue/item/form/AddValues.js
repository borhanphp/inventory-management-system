import Sidebar from "@components/sidebar";
import { Button } from "reactstrap";
import InInput from "../../../../utility/custom/InInput";


const AddValues = ( { open, toggleSidebar, handleValuesFormOpen } ) => {
    // const { brandBasicInfo } = useSelector( ( { brandsReducer } ) => brandsReducer );
    // const [isLoading, setIsLoading] = useState( false );
    // const [submitted, setSubmitted] = useState( false );
    // const dispatch = useDispatch();

    // const brandSchema = yup.object().shape( {
    //     name: brandBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
    // } );
    // const { reset, handleSubmit, formState: { errors } } = useForm( {
    //     mode: 'onChange',
    //     resolver: yupResolver( brandSchema )
    // } );


    // useEffect( () => {
    //     if ( submitted ) {
    //         dispatch( bindBrandInfo( initialBrandData ) );
    //         toast.success( 'Brand has been added' );
    //     }
    // }, [submitted] );

    // const handleOnChange = ( e ) => {
    //     const { name, value } = e.target;
    //     const updatedObj = {
    //         ...brandBasicInfo,
    //         [name]: value
    //     };
    //     dispatch( bindBrandInfo( updatedObj ) );
    // };

    // const loading = ( condition ) => {
    //     setIsLoading( condition );
    // };
    // const handleOnSubmit = () => {
    //     dispatch( addNewBrand( { ...brandBasicInfo, status: true }, loading, setSubmitted ) );
    //     toggleSidebar();
    // };
    // const handleReset = () => {
    //     reset();
    //     dispatch( bindBrandInfo( null ) );
    // };

    return (
        <>
            <Sidebar
                size="lg"
                open={open}
                title="New Brand"
                headerClassName="mb-1"
                contentClassName="pt-0"
                toggleSidebar={toggleSidebar}
                onClose={handleValuesFormOpen}
            >
                <div>
                    <InInput
                        label="Brand Name"
                        name="name"
                        bsSize="sm"
                        id="nameId"
                        // value={brandBasicInfo.name}
                        onChange={( e ) => { handleOnChange( e ); }}
                    // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
                    />
                    {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}


                    <InInput
                        label="Short Description"
                        name="note"
                        bsSize="sm"
                        id="note"
                    // value={brandBasicInfo.description}
                    // onChange={( e ) => { handleOnChange( e ); }}
                    />

                </div>
                <div className="mt-1">
                    <Button type="submit" size="sm" className="me-1" color="primary"
                    // onClick={() => { handleOnSubmit(); }}
                    // onClick={handleSubmit( handleOnSubmit )}
                    >
                        Submit
                    </Button>
                    <Button type="reset" size="sm" color="secondary" outline onClick={toggleSidebar}>
                        Cancel
                    </Button>
                </div>
            </Sidebar>

        </>
    );
};

export default AddValues;
