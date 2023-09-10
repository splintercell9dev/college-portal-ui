import { saveAs } from "file-saver";
import server from "../../utils/axios";
import { getAccessToken } from "../../utils/functions";

function Table({ data, onRefresh, onAccRef }){
    const viewPdf = async (name) => {
        console.log(name) ;
        server.get('staff/getPdf', {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            },
            params: {
                filename: name
            }
        }).then(res => {
            console.log(res) ;
            const file = new Blob([res.data], { type: 'application/pdf' }) ;
            const url = URL.createObjectURL(file) ;
            window.open(url) ;
        }).catch(err => {
            console.error(err) ;
            if (err.response.data.error.default === 'jwt expired'){
                onAccRef() ;
            }
        }) ;
    } ;

    const downloadPdf = async (name) => {
        server.get('staff/getPdf', {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            },
            params: {
                filename: name
            }
        }).then(res => {
            console.log(res) ;
            const file = new Blob([res.data], { type: 'application/pdf' }) ;
            saveAs(file, name) ;
        }).catch(err => {
            console.error(err) ;
            if (err.response?.data?.error.default === 'jwt expired'){
                onAccRef() ;
            }
        }) ;
    } ;

    return (
        <>
            {
                data && data?.length ?
                <div className="p-3 container-fluid" style={{ overflowX: 'auto' }}>
                    <table className="table table-striped table-responsive">
                        <thead className="table-dark">
                            <tr className="text-center">
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Contact</th>
                                <th scope="col">Address</th>
                                <th scope="col">Date</th>
                                <th scope="col">PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(s => {
                                    return (
                                        <tr key={s.id}>
                                            <td>{s.fullName}</td>
                                            <td>{s.email}</td>
                                            <td>{s.contact}</td>
                                            <td>{s.address}</td>
                                            <td>{new Date(s.createdAt).toLocaleString()}</td>
                                            <td className="d-flex fl">
                                                <button onClick={() => viewPdf(s.fileName)} className="btn btn-primary me-2">View</button>
                                                <button className="btn btn-primary" onClick={() => downloadPdf(s.fileName)}>Download</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                :
                <div className="d-flex justify-content-center align-items-center flex-column flex-grow-1">
                    <p>No students uploaded their details yet</p>
                    <button onClick={onRefresh} className="btn btn-primary">Refresh</button>
                </div>
            }
        </>
    ) ;
}

export default Table ;