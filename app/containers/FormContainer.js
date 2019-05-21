import React, {Component} from 'react';
import axios from 'axios';
import XLSX from 'xlsx';
import { getOrganizations, getGroups, getRooftops } from "../utils/api";
import Select from 'react-select';
import TextArea from '../components/TextArea';
import StyledDropzone from '../components/StyledDropzone';

class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationOptions: [],
            organizationSelection: '',
            groupOptions: [],
            groupSelection: '',
            rooftopOptions: [],
            rooftopSelection: '',
            serials_string: '',
            uploadedFile: null,
            serials_xlsx: [],
            isFileUploaded: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleOrganizationSelect = this.handleOrganizationSelect.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleRooftopSelect = this.handleRooftopSelect.bind(this);
        this.handleSerialsChange = this.handleSerialsChange.bind(this);
        this.handleOnDropAccepted = this.handleOnDropAccepted.bind(this);
        this.handleOnDropRejected = this.handleOnDropRejected.bind(this);
    }

    componentDidMount() {
        const sort_by = (field, reverse, primer) => {
            const key = primer ? 
                function(x) {return primer(x[field])} : 
                function(x) {return x[field]};
         
            reverse = !reverse ? 1 : -1;
         
            return function (a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            } 
        }
        
        getOrganizations()
            .then(res => {
                this.setState({
                    organizationOptions: res.sort(sort_by('name', false, function(a) {
                        return a.toUpperCase()})),
                    organizationSelection: '',
                    serialsInput: ''
                });
            });
        getGroups()
            .then(res => {
                this.setState({
                    groupOptions: res.sort(sort_by('name', false, function(a) {
                        return a.toUpperCase()})),
                    groupSelection: '',
                    serialsInput: ''
                });
            });
        getRooftops()
            .then(res => {
                this.setState({
                    rooftopOptions: res.sort(sort_by('name', false, function(a) {
                        return a.toUpperCase()})),
                    rooftopSelection: '',
                    serialsInput: '',
                });
            });
        }

    handleOrganizationSelect = (organizationSelection) => {
        this.setState({ 
            organizationSelection, 
            groupSelection: '', 
            rooftopSelection: '' });
        console.log('Organization:', organizationSelection.name);
    }

    handleGroupSelect = (groupSelection) => {
        this.setState({ 
            groupSelection,
            rooftopSelection: '' });
        console.log('Group:', groupSelection.name);
    }

    handleRooftopSelect = (rooftopSelection) => {
        this.setState({ rooftopSelection });
        console.log('Rooftop:', rooftopSelection.name);
    }

    handleSerialsChange = (e) => {
        this.setState({ serials_string: e.target.value });
        console.log('Serials:', this.state.serials_string);
    }

    handleOnDropAccepted = (file) => {
        this.setState({ 
            uploadedFile: file[0], 
            isFileUploaded: true });
        console.log('Uploaded File: ', this.state.uploadedFile);

		const rABS = true;
        const reader = new FileReader();
        reader.onload = ({ target }) => {
            let data = target.result;
            if (!rABS) data = new Uint8Array(data);
            const wb = XLSX.read(data, { type: rABS ? "binary" : "array" });
            const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
            const fileData = XLSX.utils.sheet_to_json(ws, {header:1});
            const mergedFileData = [].concat.apply([], fileData)
            this.setState({ serials_xlsx: mergedFileData })
            console.log("Uploaded File Data: ", this.state.serials_xlsx);
        };
        if (rABS) reader.readAsBinaryString(this.state.uploadedFile);
        else reader.readAsArrayBuffer(this.state.uploadedFile);
    }

    handleOnDropRejected = () => {
        this.setState({ 
            uploadedFile: null,
            isFileUploaded: false,
            serials_xlsx: [],
        })
        console.log('File Rejected.')
    }

    handleClearForm = () => {
        this.setState({
            organizationSelection: '',
            groupSelection: '',
            rooftopSelection: '',
            serials_string: '',
            uploadedFile: null,
            serials_xlsx: [],
            isFileUploaded: false,
        });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        var serials_string = this.state.serials_string.split(/\W/);
        var serials_textForm = serials_string.filter(function(el) {
            return el != "";
        })
        const serials = serials_textForm.concat(this.state.serials_xlsx);
        var devices = [];
        for (let i = 0; i < serials.length; i++) 
        {
            devices.push({
                "serial_number": serials[i],
                "rooftop_id": JSON.stringify(this.state.rooftopSelection.id),
            });
        }

        console.log('Uploaded Data: ', devices);

        axios({
            url: 'url',
            method: 'POST',
            data: {
                "devices": devices
            },
            headers: {
                'Content-Type': 'application/json',
            }})
            .then((response) => {
                console.log('Successful! Devices Imported: ', response);
                alert("Success!\nDevices Successfully Imported.");
                this.handleClearForm(e);
            })
            .catch((error) => {
                console.log('Unsuccessful. ', error)
                alert("Error.\nDevices Failed to Import.");
            })
    }

    render() {
        const filteredGroups = this.state.groupOptions.filter((group) => (group.organization_id === this.state.organizationSelection.id) & (this.state.rooftopOptions.some((rooftop) => rooftop.group_id === group.id)));
        const filteredRooftops = this.state.rooftopOptions.filter((rooftop) => rooftop.group_id === this.state.groupSelection.id);
        
        return (
            <form className="form-container" onSubmit={this.handleFormSubmit}>
                <h3> Organization </h3>
                <Select
                    name={'organizations'}
                    value={this.state.organizationSelection}
                    onChange={this.handleOrganizationSelect}
                    placeholder={'Select an Organization'}
                    options={this.state.organizationOptions}
                        getOptionLabel={(opt) => opt.name}
                        getOptionValue={(opt) => opt.id} />
                <h3> Group </h3>
                <Select
                    name={'groups'}
                    isDisabled={this.state.organizationSelection == ''}
                    value={this.state.groupSelection}
                    onChange={this.handleGroupSelect}
                    placeholder={'Select a Group'}
                    options={filteredGroups}
                        getOptionLabel={(opt) => opt.name}
                        getOptionValue={(opt) => opt.id} />
                <h3> Rooftop </h3>
                <Select
                    name={'rooftops'}
                    isDisabled={this.state.groupSelection == ''}
                    value={this.state.rooftopSelection}
                    onChange={this.handleRooftopSelect}
                    placeholder={'Select a Rooftop'}
                    options={filteredRooftops}
                        getOptionLabel={(opt) => opt.name}
                        getOptionValue={(opt) => opt.id} />
                <h3> Serials </h3>
                <TextArea
                    name={'serials'}
                    resize={true}
                    content={this.state.serials_string}
                    controlFunc={this.handleSerialsChange}
                    placeholder={'Input Serials Here or Upload .xlsx File Below'} />
                <StyledDropzone
                    onDropAccepted={this.handleOnDropAccepted}
                    onDropRejected={this.handleOnDropRejected}
                    isFileUploaded={this.state.isFileUploaded}
                    accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    minSize={0}
                    maxSize={1048576}
                    multiple={false}/>
                <input
                    type="submit"
                    className="btn btn-primary float-right"
                    value="Submit"
                    disabled={!this.state.rooftopSelection || (!this.state.serials_string  && !this.state.uploadedFile)} />
                <button
                    className="btn btn-link float-left"
                    onClick={this.handleClearForm}>Clear</button>
            </form>
        );
    }
}
export default FormContainer;